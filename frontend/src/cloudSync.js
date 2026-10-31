import { useEffect, useRef } from "react";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? `http://${window.location.hostname}:5000` : "https://leancode.onrender.com")
).replace(/\/+$/, "");

const POLL_MS = 30000;

export function getAuthToken() {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

function same(a, b) {
  try {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  } catch {
    return false;
  }
}

function isEmptyValue(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// ---------------------------------------------------------------
// Generic helpers used by the merge functions in each page.
// ---------------------------------------------------------------

// Merge two arrays of objects by id, keeping the entry with the newer
// updatedAt/createdAt. `local` wins when timestamps are equal.
export function mergeById(localList, serverList, getId = (item) => item?.id) {
  const map = new Map();
  const stamp = (item) =>
    new Date(item?.updatedAt || item?.createdAt || 0).getTime() || 0;

  [...(Array.isArray(serverList) ? serverList : []), ...(Array.isArray(localList) ? localList : [])]
    .forEach((item) => {
      const id = getId(item);
      if (id == null) return;
      const key = String(id);
      const previous = map.get(key);
      if (!previous || stamp(item) >= stamp(previous)) {
        map.set(key, item);
      }
    });

  return [...map.values()];
}

// Union of primitive arrays (e.g. completed module titles).
export function mergeUnique(localList, serverList) {
  return [
    ...new Set([
      ...(Array.isArray(serverList) ? serverList : []),
      ...(Array.isArray(localList) ? localList : []),
    ]),
  ];
}

// Deep merge of plain objects. Local values win for the same key,
// but keys that exist on only one device are always kept.
export function deepMergeObjects(local, server) {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

  if (!isObj(local)) return local === undefined ? server : local;
  if (!isObj(server)) return local;

  const out = { ...server };
  Object.keys(local).forEach((key) => {
    out[key] = isObj(local[key]) && isObj(server[key])
      ? deepMergeObjects(local[key], server[key])
      : local[key];
  });
  return out;
}

// Like deepMergeObjects, but a "true" on either device stays true
// (lesson completed, quiz passed...). Progress should never be lost.
export function mergeProgress(local, server) {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

  if (typeof local === "boolean" && typeof server === "boolean") {
    return local || server;
  }
  if (!isObj(local) || !isObj(server)) {
    return local === undefined ? server : local;
  }

  const out = { ...server };
  Object.keys(local).forEach((key) => {
    out[key] = key in server ? mergeProgress(local[key], server[key]) : local[key];
  });
  return out;
}

// Merge Beginner Zone data (quiz attempts, guided modules, daily challenges,
// custom roadmaps...) from two devices without losing progress on either.
export function mergeBeginnerData(localData, serverData) {
  const local = localData && typeof localData === "object" ? localData : {};
  const server = serverData && typeof serverData === "object" ? serverData : {};

  const merged = mergeProgress(local, server);

  // Roadmaps: newest edit per roadmap wins; deleted roadmaps stay deleted.
  const deleted = mergeUnique(local.deletedRoadmapIds, server.deletedRoadmapIds).map(String);
  merged.deletedRoadmapIds = deleted;
  merged.customRoadmaps = mergeById(local.customRoadmaps, server.customRoadmaps)
    .filter((roadmap) => !deleted.includes(String(roadmap.id)))
    .map((roadmap) => ({
      ...roadmap,
      completed: Array.isArray(roadmap.completed) ? roadmap.completed : [],
    }));

  return merged;
}

// Merge saved code submissions of every problem from two devices.
export function mergeSubmissions(local, server) {
  const l = local && typeof local === "object" && !Array.isArray(local) ? local : {};
  const s = server && typeof server === "object" && !Array.isArray(server) ? server : {};
  const time = (item) => new Date(item?.submittedAt || 0).getTime() || 0;
  const historyOf = (record) =>
    Array.isArray(record?.history) ? record.history : record?.latest ? [record.latest] : [];
  const accepted = (item) =>
    String(item?.verdict || item?.status || "").trim().toLowerCase() === "accepted" ||
    item?.accepted === true;

  const out = {};

  new Set([...Object.keys(s), ...Object.keys(l)]).forEach((id) => {
    const a = l[id];
    const b = s[id];

    if (!a) { out[id] = b; return; }
    if (!b) { out[id] = a; return; }

    const seen = new Map();
    [...historyOf(b), ...historyOf(a)].forEach((item) => {
      const key = `${item?.submittedAt || ""}|${item?.language || ""}|${item?.verdict || item?.status || ""}`;
      if (!seen.has(key)) seen.set(key, item);
    });

    const history = [...seen.values()].sort((x, y) => time(y) - time(x)).slice(0, 20);
    const aNewer = time(a.latest) >= time(b.latest);
    const base = aNewer ? a : b;
    const other = aNewer ? b : a;

    out[id] = {
      ...other,
      ...base,
      latest: history[0] || base.latest,
      history,
      solved: a.solved === true || b.solved === true || history.some(accepted),
      byLanguage: { ...(other.byLanguage || {}), ...(base.byLanguage || {}) },
    };
  });

  return out;
}

// ---------------------------------------------------------------
// useCloudField
//
// Keeps one learning-data field in sync between this device and the
// account stored on the server.
//
// - On start it loads the server copy and merges it with local data.
// - Local changes are saved (debounced) with the version we last saw.
//   If another device saved first, the server answers with a conflict,
//   we merge and save again, so nothing is silently overwritten.
// - Every 30s / when the tab regains focus we check whether another
//   device changed the field and pull it in.
// ---------------------------------------------------------------
export function useCloudField({
  field,
  enabled,
  value,
  onRemote,
  merge,
  userKey,
  debounceMs = 800,
}) {
  const valueRef = useRef(value);
  const onRemoteRef = useRef(onRemote);
  const mergeRef = useRef(merge);
  const stateRef = useRef({ ready: false, version: 0, synced: "null" });
  const timerRef = useRef(null);
  const pushingRef = useRef(false);

  valueRef.current = value;
  onRemoteRef.current = onRemote;
  mergeRef.current = merge || ((local, server) => (isEmptyValue(local) ? server : local));

  // Reset and run the first load whenever the account changes.
  useEffect(() => {
    stateRef.current = { ready: false, version: 0, synced: "null" };
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!enabled) return undefined;

    const token = getAuthToken();
    if (!token) return undefined;

    let cancelled = false;

    async function initialLoad() {
      try {
        const response = await axios.get(`${API_URL}/api/learning-data`, {
          headers: authHeaders(token),
          timeout: 20000,
        });

        if (cancelled || !response.data?.success) return;

        const serverValue = response.data.data?.[field];
        const version = response.data.versions?.[field] || 0;
        const local = valueRef.current;

        const merged = isEmptyValue(serverValue)
          ? local
          : mergeRef.current(local, serverValue);

        stateRef.current = {
          ready: true,
          version,
          synced: JSON.stringify(serverValue ?? null),
        };

        if (!same(merged, local)) {
          onRemoteRef.current(merged);
        } else {
          schedulePush();
        }
      } catch (error) {
        // Stay offline-friendly: local data keeps working.
        console.error(`Cloud sync load failed (${field}):`, error.response?.data || error.message);
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, userKey, field]);

  function schedulePush() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(push, debounceMs);
  }

  async function push(attempt = 0) {
    const state = stateRef.current;
    const token = getAuthToken();
    if (!state.ready || !token || pushingRef.current) return;

    const current = valueRef.current;
    if (JSON.stringify(current ?? null) === state.synced) return;

    pushingRef.current = true;
    try {
      const response = await axios.put(
        `${API_URL}/api/learning-data`,
        { [field]: current, baseVersions: { [field]: state.version } },
        { headers: authHeaders(token), timeout: 20000 }
      );

      const conflict = response.data?.conflicts?.[field];

      if (conflict) {
        // Another device saved first: merge, then save the merged result.
        const merged = mergeRef.current(valueRef.current, conflict.value);
        stateRef.current = {
          ready: true,
          version: conflict.version,
          synced: JSON.stringify(conflict.value ?? null),
        };
        pushingRef.current = false;

        if (!same(merged, valueRef.current)) {
          onRemoteRef.current(merged);
        } else if (attempt < 3) {
          return push(attempt + 1);
        }
        return;
      }

      stateRef.current = {
        ready: true,
        version: response.data?.versions?.[field] ?? state.version,
        synced: JSON.stringify(current ?? null),
      };
    } catch (error) {
      console.error(`Cloud sync save failed (${field}):`, error.response?.data || error.message);
    } finally {
      pushingRef.current = false;
    }

    // Changes may have happened while we were saving.
    if (JSON.stringify(valueRef.current ?? null) !== stateRef.current.synced) {
      schedulePush();
    }
  }

  // Leaving the page with an unsaved change: save it right away.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        push();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save local changes.
  useEffect(() => {
    if (!enabled || !stateRef.current.ready) return undefined;
    if (JSON.stringify(value ?? null) === stateRef.current.synced) return undefined;

    schedulePush();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enabled]);

  // Pull changes made on another device.
  useEffect(() => {
    if (!enabled) return undefined;

    let stopped = false;

    async function pull() {
      const token = getAuthToken();
      const state = stateRef.current;
      if (stopped || !token || !state.ready || pushingRef.current) return;

      try {
        const versionResponse = await axios.get(
          `${API_URL}/api/learning-data/versions`,
          { headers: authHeaders(token), timeout: 15000 }
        );
        const serverVersion = versionResponse.data?.versions?.[field] || 0;
        if (stopped || serverVersion === stateRef.current.version) return;

        const response = await axios.get(`${API_URL}/api/learning-data`, {
          headers: authHeaders(token),
          timeout: 20000,
        });
        if (stopped || !response.data?.success) return;

        const serverValue = response.data.data?.[field];
        const version = response.data.versions?.[field] || 0;
        const local = valueRef.current;
        const hasUnsavedLocal =
          JSON.stringify(local ?? null) !== stateRef.current.synced;

        stateRef.current = {
          ready: true,
          version,
          synced: JSON.stringify(serverValue ?? null),
        };

        // Nothing unsaved here: the other device's data is simply newer.
        const next = hasUnsavedLocal
          ? mergeRef.current(local, serverValue)
          : serverValue;

        if (!same(next, local)) {
          onRemoteRef.current(next);
        }
      } catch (error) {
        console.error(`Cloud sync pull failed (${field}):`, error.response?.data || error.message);
      }
    }

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") pull();
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") pull();
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      clearInterval(interval);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, userKey, field]);
}
