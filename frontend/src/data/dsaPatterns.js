export const dsaPatterns = [
  "Arrays",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Prefix Sum",
  "Binary Search",
  "Sorting",
  "Linked List",
  "Stack",
  "Queue",
  "Recursion",
  "Backtracking",
  "Trees",
  "Graphs",
  "Dynamic Programming",
];

export const dsaQuestions = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    pattern: "Arrays",
    topic: "Arrays",

    description:
      "Given an array of integers and a target, find the indices of two numbers that add up to the target.",

    supportedLanguages: ["java", "cpp"],

    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int[] nums = new int[n];

        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }

        int target = sc.nextInt();
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];

            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                sc.close();
                return;
            }

            map.put(nums[i], i);
        }

        System.out.println("-1 -1");
        sc.close();
    }
}`,

      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    unordered_map<int, int> mp;

    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];

        if (mp.count(complement)) {
            cout << mp[complement] << " " << i << endl;
            return 0;
        }

        mp[nums[i]] = i;
    }

    cout << "-1 -1" << endl;
    return 0;
}`,
    },

    testCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
      },
      {
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
      },
    ],

    constraints: [
      "The array contains integers.",
      "A valid pair exists for each test case.",
    ],

    examples: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
      },
    ],

    tags: ["Arrays", "Hashing"],

    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
];