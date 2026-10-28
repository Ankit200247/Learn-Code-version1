import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./BeginnerZone.css";

const LANGUAGES = [
  { id: "java", name: "Java", icon: "☕" },
  { id: "c", name: "C", icon: "C" },
  { id: "cpp", name: "C++", icon: "⚙️" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "javascript", name: "JavaScript", icon: "🟨" },
];

const TOPICS = {
  java: [
    "Fundamentals",
    "Variables & Data Types",
    "Conditionals",
    "Loops",
    "Arrays",
    "Strings",
    "OOP",
  ],
  cpp: [
    "Fundamentals",
    "Variables & Data Types",
    "Conditionals",
    "Loops",
    "Arrays",
    "Strings",
    "OOP",
  ],
  python: [
    "Fundamentals",
    "Variables & Data Types",
    "Conditionals",
    "Loops",
    "Lists",
    "Strings",
    "Functions",
    "OOP",
  ],
  javascript: [
    "Fundamentals",
    "Variables & Data Types",
    "Conditionals",
    "Loops",
    "Arrays",
    "Strings",
    "Functions",
  ],
};
const PLACEMENT_SUBJECTS = [
  { id: "oops", name: "OOPs", icon: "🧩" },
  { id: "dbms", name: "DBMS", icon: "🗄️" },
  { id: "sql", name: "SQL", icon: "💾" },
  { id: "cn", name: "Computer Networks", icon: "🌐" },
  { id: "os", name: "Operating Systems", icon: "💻" },
  { id: "aptitude", name: "Aptitude", icon: "🧠" },
  { id: "cloud", name: "Cloud Computing", icon: "☁️" },
];

function buildPlacementMcqs(prefix, topic, questions) {
  return questions.map(([question, options, answerIndex, explanation], index) => ({
    id: `${prefix}${index + 1}`,
    topic,
    question,
    options,
    answer: options[answerIndex],
    explanation,
  }));
}

const MCQS = {
  java: [
    { id: "j1", topic: "Fundamentals", question: "Which method is the entry point of a standard Java application?", options: ["start()", "main()", "run()", "init()"], answer: 1, explanation: "Java applications typically begin execution from public static void main(String[] args)." },
    { id: "j2", topic: "Variables & Data Types", question: "Which type stores a whole number in Java?", options: ["boolean", "String", "int", "char[]"], answer: 2, explanation: "int is Java's primitive type for 32-bit signed whole numbers." },
    { id: "j3", topic: "Conditionals", question: "Which Java keyword executes a block when a condition is true?", options: ["if", "for", "while", "switch"], answer: 0, explanation: "The if statement executes its block when the condition evaluates to true." },
    { id: "j4", topic: "Loops", question: "Which loop is commonly used when the number of iterations is known?", options: ["for", "switch", "if", "try"], answer: 0, explanation: "A for loop conveniently groups initialization, condition, and update." },
  ],
  cpp: [
    { id: "c1", topic: "Fundamentals", question: "Which header is commonly used for cout and cin?", options: ["<stdio.h>", "<iostream>", "<string.h>", "<input>"], answer: 1, explanation: "The iostream header provides standard input and output streams such as cin and cout." },
    { id: "c2", topic: "Variables & Data Types", question: "Which type stores a whole number?", options: ["int", "string", "void", "cout"], answer: 0, explanation: "int is the standard integer type in C++." },
    { id: "c3", topic: "Conditionals", question: "Which C++ keyword executes code when a condition is true?", options: ["if", "for", "while", "return"], answer: 0, explanation: "C++ uses if to execute a block conditionally." },
  ],
  python: [
    { id: "p1", topic: "Fundamentals", question: "Which function displays text in Python?", options: ["echo()", "console()", "print()", "writeLine()"], answer: 2, explanation: "print() writes text or values to the output stream." },
    { id: "p2", topic: "Variables & Data Types", question: "Which is a valid variable assignment?", options: ["int x := 5", "x = 5", "let x == 5", "$x = 5"], answer: 1, explanation: "Python assigns a value using the = operator; a type declaration is not required." },
    { id: "p3", topic: "Conditionals", question: "Which Python keyword starts a conditional statement?", options: ["if", "for", "def", "return"], answer: 0, explanation: "Python uses if followed by a condition and a colon." },
  ],
  javascript: [
    { id: "s1", topic: "Fundamentals", question: "Which keyword can declare a block-scoped variable that can be reassigned?", options: ["const", "let", "static", "define"], answer: 1, explanation: "let declares a block-scoped variable that can be reassigned." },
    { id: "s2", topic: "Variables & Data Types", question: "Which operator checks strict equality?", options: ["=", "==", "===", ":="], answer: 2, explanation: "=== compares both value and type without coercion." },
    { id: "s3", topic: "Conditionals", question: "Which JavaScript keyword executes code when a condition is true?", options: ["if", "for", "const", "return"], answer: 0, explanation: "JavaScript uses if to conditionally execute a statement or block." },
  ],
    oops: buildPlacementMcqs("o", "OOPs", [
      ["Which concept allows a class to acquire properties of another class?", ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"], 1, "Inheritance lets a class reuse fields and methods from another class."],
      ["Which concept hides internal implementation details?", ["Inheritance", "Abstraction", "Overloading", "Compilation"], 1, "Abstraction exposes essential behavior while hiding implementation details."],
      ["Bundling data and methods in one unit is called?", ["Encapsulation", "Recursion", "Compilation", "Iteration"], 0, "Encapsulation combines data and methods and controls access to state."],
      ["One interface with different implementations describes?", ["Polymorphism", "Normalization", "Serialization", "Aggregation"], 0, "Polymorphism allows the same interface or call to behave differently."],
      ["Which is a constructor used for?", ["Destroying objects only", "Initializing new objects", "Importing packages", "Handling exceptions"], 1, "A constructor initializes an object when it is created."],
      ["Which access modifier generally restricts access to the same class?", ["public", "private", "protected", "global"], 1, "Private members are directly accessible only within their declaring class."],
      ["Method overloading means methods have?", ["Same name with different parameter lists", "Different names only", "Same body in every class", "No parameters ever"], 0, "Overloaded methods share a name but differ in parameter number, type, or order."],
      ["Method overriding is most closely associated with?", ["Runtime polymorphism", "Database indexing", "Loop termination", "Memory formatting"], 0, "Overriding lets a subclass provide its own implementation of an inherited method."],
      ["Which relationship is commonly described as an IS-A relationship?", ["Inheritance", "Composition", "Dependency injection", "Encapsulation"], 0, "A subclass is a type of its parent class, so inheritance models IS-A."],
      ["Which relationship is commonly described as HAS-A?", ["Inheritance", "Composition/association", "Method overloading", "Casting"], 1, "HAS-A describes an object that contains or refers to another object."],
      ["Can an abstract class usually be instantiated directly?", ["Yes, always", "No", "Only with static", "Only if final"], 1, "Abstract classes are incomplete base types and normally cannot be instantiated directly."],
      ["An interface primarily specifies?", ["A contract of operations", "A database row", "A memory address", "A loop condition"], 0, "An interface defines behavior that implementing classes agree to provide."],
      ["Which keyword refers to the current object in Java?", ["this", "super", "selfClass", "current"], 0, "In Java, this refers to the current object instance."],
      ["Which keyword refers to superclass members in Java?", ["this", "super", "parentOnly", "basecall"], 1, "super can refer to superclass members and constructors."],
      ["Which principle helps prevent direct unauthorized access to fields?", ["Encapsulation", "Recursion", "Inheritance alone", "Tokenization"], 0, "Private fields with controlled methods protect an object's internal state."],
      ["A class is best described as a?", ["Blueprint for objects", "Running operating system", "Single variable", "Network protocol"], 0, "A class defines the data and behavior its objects can have."],
      ["An object is an instance of a?", ["Class", "Package manager", "Compiler error", "Loop"], 0, "An object is a concrete instance created from a class."],
      ["Which feature allows the same method call to act differently for different objects?", ["Polymorphism", "Encapsulation", "Normalization", "Deadlock"], 0, "Polymorphism dispatches behavior according to the object's implementation or type."],
      ["Which is NOT one of the common four OOP pillars?", ["Abstraction", "Encapsulation", "Polymorphism", "Compilation"], 3, "The four commonly taught pillars are abstraction, encapsulation, inheritance, and polymorphism."],
      ["A final class in Java cannot be?", ["Instantiated", "Extended", "Imported", "Used as a type"], 1, "A final class cannot be subclassed."],
    ]),
    dbms: buildPlacementMcqs("d", "DBMS", [
      ["Which key uniquely identifies each record in a table?", ["Foreign key", "Primary key", "Duplicate key", "Non-key"], 1, "A primary key uniquely identifies each row."],
      ["What is the main purpose of normalization?", ["Increase duplication", "Reduce data redundancy", "Delete all tables", "Increase file size"], 1, "Normalization structures tables to reduce unnecessary duplication and anomalies."],
      ["A foreign key is mainly used to?", ["Encrypt a table", "Link related tables", "Sort every row", "Create a backup"], 1, "A foreign key references a key in another or the same table to maintain relationships."],
      ["Which ACID property means a transaction happens fully or not at all?", ["Consistency", "Isolation", "Atomicity", "Durability"], 2, "Atomicity prevents a transaction from being partially applied."],
      ["Which ACID property ensures committed data survives failures?", ["Durability", "Isolation", "Atomicity", "Redundancy"], 0, "Durability means committed changes persist after a system failure."],
      ["A row in a relational table is also called a?", ["Tuple/record", "Attribute", "Schema", "Domain"], 0, "A row represents one tuple or record."],
      ["A column in a relational table is also called an?", ["Attribute/field", "Tuple", "Transaction", "Relationship only"], 0, "A column defines an attribute of the relation."],
      ["Which normal form requires atomic values and no repeating groups?", ["1NF", "2NF", "3NF", "BCNF only"], 0, "First Normal Form requires each field to contain an atomic value."],
      ["A candidate key is?", ["Any minimal attribute set that uniquely identifies rows", "Always a foreign key", "A duplicate row", "A query plan"], 0, "A candidate key is a minimal superkey."],
      ["A superkey is a set of attributes that?", ["Uniquely identifies a row", "Always contains nulls", "Cannot identify rows", "Stores only indexes"], 0, "A superkey uniquely identifies records and may contain extra attributes."],
      ["Which command removes a table definition and its data?", ["DROP", "SELECT", "UPDATE", "GRANT"], 0, "DROP removes the table object itself."],
      ["Which operation changes existing values in rows?", ["UPDATE", "CREATE", "COMMIT only", "DESCRIBE"], 0, "UPDATE modifies values in existing records."],
      ["Which property requires a transaction to move the database between valid states?", ["Consistency", "Atomicity", "Isolation", "Durability"], 0, "Consistency preserves defined constraints before and after a transaction."],
      ["A DBMS is software used to?", ["Manage and access databases", "Only draw images", "Compile every language", "Route internet packets"], 0, "A DBMS provides tools to define, query, update, and control database data."],
      ["Which is an example of a relational DBMS?", ["MySQL", "HTML", "React", "DNS"], 0, "MySQL stores data using relational tables and SQL."],
      ["A transaction is a?", ["Logical unit of database work", "Column heading only", "Network cable", "Programming language"], 0, "A transaction groups operations that should be treated as one logical unit."],
      ["Which ACID property limits interference between concurrent transactions?", ["Isolation", "Durability", "Atomicity", "Consistency"], 0, "Isolation controls how concurrent transactions affect each other."],
      ["An index is primarily used to?", ["Speed up data retrieval", "Guarantee no storage use", "Replace every table", "Prevent all updates"], 0, "Indexes can improve search performance at the cost of storage and update overhead."],
      ["A view is generally a?", ["Virtual table based on a query", "Physical network device", "Primary key value", "Transaction log only"], 0, "A view presents query results as a virtual table."],
      ["Which anomaly can occur when duplicated data is updated inconsistently?", ["Update anomaly", "Compile anomaly", "Routing anomaly", "Loop anomaly"], 0, "Redundant copies can become inconsistent when only some copies are changed."],
    ]),
    sql: buildPlacementMcqs("q", "SQL", [
      ["Which SQL command retrieves data from a table?", ["GET", "FETCH ALL", "SELECT", "OPEN"], 2, "SELECT retrieves data from one or more tables."],
      ["Which clause filters rows based on a condition?", ["ORDER BY", "WHERE", "GROUP BY", "SELECT"], 1, "WHERE filters rows before grouping or output."],
      ["Which clause sorts query results?", ["SORT", "ORDER BY", "ARRANGE", "GROUP BY"], 1, "ORDER BY sorts result rows by one or more expressions."],
      ["Which function counts rows?", ["SUM()", "COUNT()", "TOTALROWS()", "NUMBER()"], 1, "COUNT returns the number of rows or non-NULL values depending on its argument."],
      ["Which command adds new rows to a table?", ["INSERT INTO", "ALTER", "SELECT", "GRANT"], 0, "INSERT INTO adds records to a table."],
      ["Which command changes existing rows?", ["UPDATE", "CREATE", "DROP", "SHOW"], 0, "UPDATE modifies selected records, commonly with a WHERE clause."],
      ["Which command deletes selected rows?", ["REMOVE", "DELETE", "CLEAR TABLE", "ERASE DATABASE"], 1, "DELETE removes rows and can use WHERE to target particular records."],
      ["Which condition checks for missing SQL values?", ["= NULL", "IS NULL", "== NULL", "EMPTY"], 1, "SQL uses IS NULL or IS NOT NULL to test null values."],
      ["Which operator matches a pattern with wildcards?", ["LIKE", "MATCHES ALL", "PATTERN", "EQUALS"], 0, "LIKE supports patterns using wildcards such as % and _."],
      ["What does COUNT(*) count?", ["All rows in the result", "Only NULL rows", "Only text columns", "Only unique rows"], 0, "COUNT(*) counts result rows regardless of individual column nulls."],
      ["Which clause groups rows for aggregate calculations?", ["GROUP BY", "ORDER BY", "WHERE", "LIMIT BY"], 0, "GROUP BY forms groups that aggregate functions can summarize."],
      ["Which clause filters groups after aggregation?", ["WHERE", "HAVING", "FROM", "VALUES"], 1, "HAVING filters grouped results, often using aggregate conditions."],
      ["Which join returns only matching rows from both tables?", ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "FULL JOIN"], 0, "INNER JOIN returns rows where the join condition matches in both tables."],
      ["Which join keeps every row from the left table?", ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"], 1, "LEFT JOIN preserves all left-side rows and fills unmatched right-side columns with NULL."],
      ["Which keyword removes duplicate rows from results?", ["UNIQUE ONLY", "DISTINCT", "SINGLE", "NO DUPLICATES"], 1, "DISTINCT removes duplicate result rows for the selected expressions."],
      ["Which constraint prevents a column from containing NULL?", ["NOT NULL", "DEFAULT", "CHECK ONLY", "INDEX"], 0, "NOT NULL requires a value for that column."],
      ["Which command changes a table's structure?", ["ALTER TABLE", "UPDATE TABLE", "REVISE ROW", "SELECT TABLE"], 0, "ALTER TABLE adds, changes, or removes table definitions depending on the DBMS."],
      ["Which command makes a transaction's changes permanent?", ["ROLLBACK", "COMMIT", "UNDO", "REVOKE"], 1, "COMMIT finalizes a transaction's changes."],
      ["Which command undoes uncommitted transaction changes?", ["COMMIT", "ROLLBACK", "GRANT", "INSERT"], 1, "ROLLBACK cancels uncommitted changes in a transaction."],
      ["Which operator tests whether a value belongs to a list?", ["BETWEEN", "IN", "LIKE", "EXISTS ONLY"], 1, "IN checks whether an expression matches any value in a specified list or subquery."],
    ]),
    cn: buildPlacementMcqs("n", "Computer Networks", [
      ["How many layers are in the OSI model?", ["4", "5", "7", "8"], 2, "The OSI reference model has seven layers."],
      ["Which protocol is commonly used to securely browse websites?", ["HTTP", "HTTPS", "FTP", "SMTP"], 1, "HTTPS uses TLS to protect browser-server communication."],
      ["Which OSI layer routes packets between networks?", ["Physical", "Data Link", "Network", "Presentation"], 2, "The Network layer handles logical addressing and routing."],
      ["Which protocol translates domain names to IP addresses?", ["DNS", "DHCP", "FTP", "ARP only"], 0, "DNS resolves domain names to records such as IP addresses."],
      ["Which protocol automatically assigns IP configuration to hosts?", ["HTTP", "DHCP", "SMTP", "SSH"], 1, "DHCP leases IP addresses and other network settings to clients."],
      ["Which transport protocol is connection-oriented and reliable?", ["UDP", "TCP", "IP", "ARP"], 1, "TCP provides ordered, reliable byte-stream delivery."],
      ["Which protocol is connectionless and has low overhead?", ["TCP", "UDP", "HTTPS", "FTP"], 1, "UDP sends datagrams without TCP's connection and retransmission guarantees."],
      ["What does an IP address identify logically?", ["A network interface on an IP network", "A website's HTML tag", "A file extension", "A CPU core"], 0, "IP addresses are logical addresses used to deliver packets to interfaces."],
      ["Which device forwards frames using MAC addresses?", ["Switch", "Router", "Modem only", "Repeater only"], 0, "A Layer 2 switch forwards Ethernet frames based on MAC address tables."],
      ["Which device forwards packets between IP networks?", ["Hub", "Router", "Keyboard", "Bridge only"], 1, "Routers use IP routing information to forward packets between networks."],
      ["What is the usual role of ARP in IPv4 LANs?", ["Map IPv4 addresses to MAC addresses", "Encrypt web traffic", "Assign domain names", "Transfer email"], 0, "ARP discovers the link-layer address associated with a local IPv4 address."],
      ["Which protocol is commonly used to send email between mail servers?", ["SMTP", "POP3", "IMAP", "SNMP"], 0, "SMTP is used to send and relay email."],
      ["Which protocol is commonly used to retrieve email while keeping it on the server?", ["IMAP", "ARP", "ICMP", "DHCP"], 0, "IMAP synchronizes mailbox contents with the mail server."],
      ["What does bandwidth generally describe?", ["Maximum data-carrying capacity", "Physical cable length only", "Number of users only", "Signal encryption"], 0, "Bandwidth describes a link's capacity over a given time, often measured in bits per second."],
      ["What is latency?", ["Time taken for data to travel or respond", "Number of IP addresses", "Maximum file size", "A routing protocol name"], 0, "Latency is delay between sending and receiving data or a response."],
      ["Which protocol is used by ping for echo requests?", ["ICMP", "SMTP", "FTP", "TLS"], 0, "Ping commonly uses ICMP Echo Request and Echo Reply messages."],
      ["Which topology connects devices to a central switch?", ["Star", "Ring", "Bus only", "Mesh only"], 0, "In a star topology, devices connect to a central hub or switch."],
      ["What does a subnet mask help determine?", ["Network and host portions of an IPv4 address", "A password length", "Browser cache", "Email attachment type"], 0, "A subnet mask identifies which IPv4 bits represent the network prefix."],
      ["Which port is the default for HTTPS?", ["21", "25", "80", "443"], 3, "HTTPS conventionally uses TCP port 443."],
      ["Which protocol secures many remote command-line sessions?", ["SSH", "Telnet", "FTP", "HTTP"], 0, "SSH provides encrypted remote login and command execution."],
    ]),
    os: buildPlacementMcqs("s", "Operating Systems", [
      ["Which of these is an operating system?", ["MySQL", "Linux", "HTML", "React"], 1, "Linux is an operating system kernel used in many operating systems."],
      ["What is a deadlock?", ["A completed process", "Processes waiting indefinitely for resources", "A database table", "A programming language"], 1, "Deadlock can occur when processes wait on resources held by one another."],
      ["What is the main role of an operating system?", ["Manage hardware and software resources", "Only create websites", "Only store images", "Replace the CPU"], 0, "An OS manages processes, memory, files, devices, and system access."],
      ["A program in execution is called a?", ["Process", "Compiler", "Folder", "Protocol"], 0, "A process is an instance of a running program."],
      ["A thread is commonly described as?", ["A lightweight unit of execution within a process", "A disk partition", "A network cable", "A database key"], 0, "Threads share process resources while executing separate instruction flows."],
      ["Which scheduling algorithm uses a fixed time quantum?", ["Round Robin", "FCFS only", "Non-preemptive SJF only", "FIFO disk formatting"], 0, "Round Robin gives each ready process a time slice."],
      ["Which scheduling method serves processes in arrival order?", ["FCFS", "Round Robin only", "Priority inversion", "Paging"], 0, "First-Come, First-Served runs jobs in the order they arrive."],
      ["Which memory technique divides logical memory into fixed-size pages?", ["Paging", "Spooling", "Thrashing only", "Scheduling"], 0, "Paging maps fixed-size virtual pages to physical frames."],
      ["A page fault occurs when?", ["A needed page is not currently in physical memory", "A CPU is switched off", "A file is renamed", "A network cable disconnects"], 0, "A page fault triggers OS handling when a referenced page is not resident."],
      ["Virtual memory allows a system to?", ["Use secondary storage to extend the apparent address space", "Avoid all disk use", "Run without RAM", "Increase CPU clock automatically"], 0, "Virtual memory gives processes an address space larger than available physical RAM may allow."],
      ["Which is a necessary condition for deadlock?", ["Circular wait", "Unlimited resources", "No processes", "Always preemptive allocation"], 0, "Circular wait is one of the four classic necessary deadlock conditions."],
      ["Which of these is a file system?", ["NTFS", "TCP", "DNS", "HTTP"], 0, "NTFS is a file system used by Windows."],
      ["What is context switching?", ["Saving one execution state and switching to another", "Deleting all processes", "Formatting a disk", "Changing source code language"], 0, "The OS saves and restores execution state to switch CPU work between tasks."],
      ["Which mode restricts ordinary applications from privileged operations?", ["User mode", "Kernel mode", "Bootloader mode only", "Debug mode"], 0, "User mode limits direct access to privileged hardware and kernel operations."],
      ["Which component manages process scheduling and core system services?", ["Kernel", "Spreadsheet", "Web browser", "Text editor"], 0, "The kernel is the core OS component responsible for low-level resource management."],
      ["Thrashing is associated with?", ["Excessive paging activity", "Faster printing", "More network bandwidth", "Database normalization"], 0, "Thrashing occurs when paging consumes so much time that useful execution suffers."],
      ["A semaphore is used for?", ["Process/thread synchronization", "Image compression", "DNS lookup", "File naming only"], 0, "Semaphores coordinate access to shared resources among concurrent tasks."],
      ["A race condition occurs when?", ["The result depends on timing of concurrent operations", "A program has no variables", "The computer is offline", "A file is read-only"], 0, "Unsynchronized concurrent access can make outcomes depend on execution timing."],
      ["Which state means a process is waiting for an event or I/O?", ["Blocked/Waiting", "Running", "Terminated only", "New only"], 0, "A blocked process waits for an event such as I/O completion."],
      ["Which is an example of an embedded or real-time OS family?", ["FreeRTOS", "MySQL", "React", "Apache HTTP"], 0, "FreeRTOS is a real-time operating system kernel for embedded devices."],
    ]),
    cloud: buildPlacementMcqs("cl", "Cloud Computing", [
      ["What is cloud computing?", ["Using only local storage", "Delivering computing services over the internet", "A type of computer virus", "A programming language"], 1, "Cloud computing provides services such as servers, storage, databases and software over the internet."],
      ["Which is an example of a cloud service provider?", ["AWS", "HTML", "CSS", "Git"], 0, "Amazon Web Services (AWS) is a major cloud service provider."],
      ["What does IaaS stand for?", ["Internet as a Secure Service", "Infrastructure as a Service", "Integration as a Software", "Information and Storage"], 1, "IaaS provides virtualized computing infrastructure such as virtual machines, networks and storage."],
      ["What does PaaS stand for?", ["Platform as a Service", "Program as a Server", "Private access and Storage", "Process as a System"], 0, "PaaS provides a platform and tools to develop, run and manage applications."],
      ["What does SaaS stand for?", ["Storage as a Server", "Software as a Service", "System as a Software", "Security at a Site"], 1, "SaaS delivers software applications over the internet, usually through a browser or app."],
      ["Which cloud model is dedicated to one organization?", ["Public cloud", "Private cloud", "Community Wi-Fi", "Hybrid browser"], 1, "A private cloud is dedicated to a single organization, though it may be hosted internally or externally."],
      ["What is a public cloud?", ["Cloud services offered to multiple customers by a provider", "A computer without an operating system", "A private laptop folder", "A local-only database"], 0, "Public cloud infrastructure is operated by a provider and offers services to multiple customers."],
      ["What is a hybrid cloud?", ["Only two public websites", "A combination of private and public cloud environments", "A computer with two monitors", "A type of firewall rule"], 1, "Hybrid cloud combines private infrastructure with public cloud services."],
      ["What is scalability in cloud computing?", ["Changing a screen theme", "Increasing or decreasing resources to meet demand", "Deleting backups", "Turning off network access"], 1, "Scalability means resources can be adjusted as workload or demand changes."],
      ["What is elasticity in the cloud?", ["Resources automatically expand or shrink with demand", "Data is always public", "A fixed amount of storage", "A programming syntax"], 0, "Elasticity refers to matching resources dynamically to changing demand."],
      ["Why are cloud backups useful?", ["They prevent all software bugs", "They help restore data after loss or failure", "They remove the need for passwords", "They make internet access unnecessary"], 1, "Backups provide recoverable copies of data if it is lost, corrupted or deleted."],
      ["What is a virtual machine?", ["A physical keyboard", "A software-based computer that runs an operating system", "A cloud billing invoice", "A database query"], 1, "A virtual machine emulates a computer and can run its own operating system."],
      ["What is serverless computing?", ["Computing without any servers existing", "A model where the provider manages server infrastructure", "Running only on a personal laptop", "A system without code"], 1, "In serverless computing, the cloud provider manages the underlying infrastructure and often scales execution automatically."],
      ["Which practice helps protect cloud accounts?", ["Sharing passwords", "Using multi-factor authentication", "Disabling all updates", "Making storage public"], 1, "Multi-factor authentication adds another verification step beyond a password."],
      ["What does cloud storage provide?", ["A way to store data on remote provider infrastructure", "Only physical USB storage", "A programming language", "A CPU scheduling algorithm"], 0, "Cloud storage stores data on remote infrastructure that is accessed over a network."],
      ["What is an availability zone?", ["A separate isolated location within a cloud region", "A type of password", "A web browser tab", "A local text file"], 0, "Availability zones are separate locations within a region designed to improve resilience."],
      ["What is pay-as-you-go pricing?", ["Paying the same fee regardless of use", "Paying based on the resources or services consumed", "Using services without any cost", "Paying only for hardware shipping"], 1, "Pay-as-you-go pricing charges customers based on actual usage under the provider's pricing model."],
      ["What is a cloud region?", ["A geographic area containing cloud data centers", "A file extension", "A programming loop", "A password manager"], 0, "A cloud region is a geographic area in which a provider operates cloud infrastructure."],
      ["What is the purpose of a firewall in a cloud environment?", ["Control network traffic according to rules", "Increase screen brightness", "Write source code automatically", "Compress every file"], 0, "Firewalls allow or block network traffic according to configured security rules."],
      ["What is the shared responsibility model?", ["Customers and providers share security responsibilities", "The provider is responsible for every customer action", "Customers never manage access", "Security is optional in the cloud"], 0, "Cloud security responsibilities are divided between the provider and customer, depending on the service."],
    ]),
    aptitude: buildPlacementMcqs("a", "Aptitude", [
      ["What is 20% of 250?", ["25", "40", "50", "60"], 2, "20% of 250 = 0.20 × 250 = 50."],
      ["A task takes 10 days at a constant rate. What fraction is completed in one day?", ["1/2", "1/5", "1/10", "1/20"], 2, "One day's work is 1 divided by 10 days, which is 1/10."],
      ["A number increases from 80 to 100. What is the percentage increase?", ["20%", "25%", "25%", "30%"], 1, "Increase = 20; percentage increase = 20/80 × 100 = 25%."],
      ["The average of 10, 20, and 30 is?", ["15", "20", "25", "30"], 1, "Average = (10 + 20 + 30) / 3 = 20."],
      ["If 5 pens cost ₹60, what is the cost of 8 pens at the same rate?", ["₹72", "₹84", "₹96", "₹100"], 2, "One pen costs ₹12, so 8 pens cost 8 × ₹12 = ₹96."],
      ["A car travels 150 km in 3 hours. Its average speed is?", ["30 km/h", "45 km/h", "50 km/h", "60 km/h"], 2, "Speed = distance/time = 150/3 = 50 km/h."],
      ["The ratio 12:18 in simplest form is?", ["2:3", "3:2", "4:9", "6:9"], 0, "Divide both terms by their greatest common divisor, 6."],
      ["If x + 7 = 19, x equals?", ["10", "11", "12", "13"], 2, "Subtract 7 from both sides: x = 12."],
      ["A shop gives 10% discount on ₹500. What is the sale price?", ["₹400", "₹450", "₹475", "₹490"], 1, "Discount = ₹50, so sale price = ₹500 − ₹50 = ₹450."],
      ["A fair die is rolled once. Probability of getting an even number is?", ["1/6", "1/3", "1/2", "2/3"], 2, "Even outcomes are 2, 4, and 6: 3/6 = 1/2."],
      ["Find the next number: 2, 4, 8, 16, __", ["18", "24", "30", "32"], 3, "Each term doubles, so the next number is 32."],
      ["If 3 workers finish a job in 12 days, how many days would 6 equally productive workers take?", ["3", "6", "12", "24"], 1, "Doubling workers halves time: 12 × 3/6 = 6 days."],
      ["A train covers 240 km in 4 hours. How far will it travel in 7 hours at the same speed?", ["360 km", "400 km", "420 km", "480 km"], 2, "Speed = 60 km/h; in 7 hours it covers 420 km."],
      ["The simple interest on ₹1,000 at 5% per year for 2 years is?", ["₹50", "₹100", "₹150", "₹200"], 1, "SI = P × R × T / 100 = 1000 × 5 × 2 / 100 = ₹100."],
      ["If 25% of a number is 40, the number is?", ["100", "120", "160", "200"], 2, "Number = 40 / 0.25 = 160."],
      ["A person buys an item for ₹400 and sells it for ₹500. Profit percentage is?", ["20%", "25%", "30%", "40%"], 1, "Profit = ₹100; profit percentage = 100/400 × 100 = 25%."],
      ["What is the LCM of 6 and 8?", ["12", "18", "24", "48"], 2, "The smallest number divisible by both 6 and 8 is 24."],
      ["What is the HCF of 18 and 24?", ["3", "6", "9", "12"], 1, "The greatest common divisor of 18 and 24 is 6."],
      ["A is twice as old as B. If B is 12, A is?", ["6", "18", "24", "36"], 2, "A = 2 × 12 = 24 years."],
      ["A bag has 3 red and 2 blue balls. Probability of randomly selecting a blue ball is?", ["1/5", "2/5", "3/5", "1/2"], 1, "There are 2 blue balls out of 5 total, so probability is 2/5."],
    ])
};

const CONCEPT_EXAMPLES = {
  hello: {
    title: "Print Hello World",
    summary: "Display a simple message on the screen.",
    output: "Hello World",
    examples: {
      java: 'class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
      c: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello World\\n");\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}',
      python: 'print("Hello World")',
      javascript: 'console.log("Hello World");'
    }
  },
  sum: {
    title: "Sum of Two Numbers",
    summary: "Store two numbers, add them, and display the result.",
    output: "Sum = 12",
    examples: {
      java: 'class Main {\n    public static void main(String[] args) {\n        int a = 7, b = 5;\n        System.out.println("Sum = " + (a + b));\n    }\n}',
      c: '#include <stdio.h>\nint main(void) {\n    int a = 7, b = 5;\n    printf("Sum = %d\\n", a + b);\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a = 7, b = 5;\n    cout << "Sum = " << a + b << endl;\n    return 0;\n}',
      python: 'a, b = 7, 5\nprint("Sum =", a + b)',
      javascript: 'const a = 7, b = 5;\nconsole.log("Sum =", a + b);'
    }
  },
  loops: {
    title: "For loop",
    summary: "Repeats a block of code. Here, it prints numbers 1 to 5.",
    output: "1  2  3  4  5",
    examples: {
      java: 'for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}',
      c: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << i << endl;\n    }\n    return 0;\n}',
      python: 'for i in range(1, 6):\n    print(i)',
      javascript: 'for (let i = 1; i <= 5; i++) {\n    console.log(i);\n}'
    }
  },
  conditionals: {
    title: "If / else condition",
    summary: "Runs one block when the condition is true and another when it is false.",
    output: "Even number",
    examples: {
      java: 'int n = 4;\nif (n % 2 == 0) {\n    System.out.println("Even number");\n} else {\n    System.out.println("Odd number");\n}',
      c: '#include <stdio.h>\n\nint main(void) {\n    int n = 4;\n    if (n % 2 == 0) {\n        printf("Even number\\n");\n    } else {\n        printf("Odd number\\n");\n    }\n    return 0;\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 4;\n    if (n % 2 == 0) {\n        cout << "Even number";\n    } else {\n        cout << "Odd number";\n    }\n    return 0;\n}',
      python: 'n = 4\nif n % 2 == 0:\n    print("Even number")\nelse:\n    print("Odd number")',
      javascript: 'const n = 4;\nif (n % 2 === 0) {\n    console.log("Even number");\n} else {\n    console.log("Odd number");\n}'
    }
  },
  arrays: {
    title: "Array traversal",
    summary: "A loop visits each item in an array/list.",
    output: "10  20  30",
    examples: {
      java: 'int[] numbers = {10, 20, 30};\nfor (int n : numbers) {\n    System.out.println(n);\n}',
      c: 'int numbers[] = {10, 20, 30};\nfor (int i = 0; i < 3; i++) {\n    printf("%d\\n", numbers[i]);\n}',
      cpp: 'int numbers[] = {10, 20, 30};\nfor (int n : numbers) {\n    cout << n << endl;\n}',
      python: 'numbers = [10, 20, 30]\nfor n in numbers:\n    print(n)',
      javascript: 'const numbers = [10, 20, 30];\nfor (const n of numbers) {\n    console.log(n);\n}'
    }
  },
  variables: {
    title: "Variables",
    summary: "A variable stores a value that your program can use.",
    output: "Ankit",
    examples: {
      java: 'String name = "Ankit";\nSystem.out.println(name);',
      c: 'char name[] = "Ankit";\nprintf("%s\\n", name);',
      cpp: 'string name = "Ankit";\ncout << name << endl;',
      python: 'name = "Ankit"\nprint(name)',
      javascript: 'const name = "Ankit";\nconsole.log(name);'
    }
  },
  functions: {
    title: "Function",
    summary: "A function groups reusable instructions. This example returns the sum of two numbers.",
    output: "12",
    examples: {
      java: 'static int add(int a, int b) {\n    return a + b;\n}\n// Call inside main:\nSystem.out.println(add(7, 5));',
      c: 'int add(int a, int b) {\n    return a + b;\n}\n// Call from main:\nprintf("%d\\n", add(7, 5));',
      cpp: 'int add(int a, int b) {\n    return a + b;\n}\n// Call from main:\ncout << add(7, 5) << endl;',
      python: 'def add(a, b):\n    return a + b\n\nprint(add(7, 5))',
      javascript: 'function add(a, b) {\n    return a + b;\n}\nconsole.log(add(7, 5));'
    }
  },
  strings: {
    title: "String basics",
    summary: "A string stores text. This example prints a message.",
    output: "Hello, world!",
    examples: {
      java: 'String message = "Hello, world!";\nSystem.out.println(message);',
      c: 'char message[] = "Hello, world!";\nprintf("%s\\n", message);',
      cpp: 'string message = "Hello, world!";\ncout << message << endl;',
      python: 'message = "Hello, world!"\nprint(message)',
      javascript: 'const message = "Hello, world!";\nconsole.log(message);'
    }
  },

  largestTwo: {
    title: "Largest of Two Numbers",
    summary: "Compare two values and print the greater number.", output: "Largest = 8",
    examples: {
      java: 'class Main { public static void main(String[] args) { int a = 8, b = 5; int largest = (a > b) ? a : b; System.out.println("Largest = " + largest); } }',
      c: '#include <stdio.h>\nint main(void) { int a = 8, b = 5; int largest = (a > b) ? a : b; printf("Largest = %d", largest); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int a = 8, b = 5; int largest = (a > b) ? a : b; cout << "Largest = " << largest; return 0; }',
      python: 'a, b = 8, 5\nprint("Largest =", max(a, b))',
      javascript: 'const a = 8, b = 5;\nconsole.log("Largest =", Math.max(a, b));'
    }
  },
  positiveNegative: {
    title: "Positive, Negative or Zero",
    summary: "Use if / else if / else to classify a number.", output: "Positive number",
    examples: {
      java: 'class Main { public static void main(String[] args) { int n = 8; if (n > 0) System.out.println("Positive number"); else if (n < 0) System.out.println("Negative number"); else System.out.println("Zero"); } }',
      c: '#include <stdio.h>\nint main(void) { int n = 8; if (n > 0) printf("Positive number\\n"); else if (n < 0) printf("Negative number\\n"); else printf("Zero\\n"); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int n = 8; if (n > 0) cout << "Positive number"; else if (n < 0) cout << "Negative number"; else cout << "Zero"; return 0; }',
      python: 'n = 8\nif n > 0:\n    print("Positive number")\nelif n < 0:\n    print("Negative number")\nelse:\n    print("Zero")',
      javascript: 'const n = 8;\nif (n > 0) console.log("Positive number");\nelse if (n < 0) console.log("Negative number");\nelse console.log("Zero");'
    }
  },
  table: {
    title: "Multiplication Table",
    summary: "Use a loop to print the first five multiples of a number.", output: "5 10 15 20 25",
    examples: {
      java: 'class Main { public static void main(String[] args) { int n = 5; for (int i = 1; i <= 5; i++) System.out.print((n * i) + " "); } }',
      c: '#include <stdio.h>\nint main(void) { int n = 5; for (int i = 1; i <= 5; i++) printf("%d ", n * i); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int n = 5; for (int i = 1; i <= 5; i++) cout << n * i << " "; return 0; }',
      python: 'n = 5\nfor i in range(1, 6):\n    print(n * i, end=" ")',
      javascript: 'const n = 5;\nfor (let i = 1; i <= 5; i++) console.log(n * i);'
    }
  },
  factorial: {
    title: "Factorial of a Number",
    summary: "Multiply all integers from 1 up to n.", output: "Factorial = 120",
    examples: {
      java: 'class Main { public static void main(String[] args) { int n = 5, fact = 1; for (int i = 1; i <= n; i++) fact *= i; System.out.println("Factorial = " + fact); } }',
      c: '#include <stdio.h>\nint main(void) { int n = 5, fact = 1; for (int i = 1; i <= n; i++) fact *= i; printf("Factorial = %d\\n", fact); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int n = 5, fact = 1; for (int i = 1; i <= n; i++) fact *= i; cout << "Factorial = " << fact; return 0; }',
      python: 'n = 5\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint("Factorial =", fact)',
      javascript: 'const n = 5;\nlet fact = 1;\nfor (let i = 1; i <= n; i++) fact *= i;\nconsole.log("Factorial =", fact);'
    }
  },
  reverse: {
    title: "Reverse a String",
    summary: "Read a short string and print its characters in reverse order.", output: "olleH",
    examples: {
      java: 'class Main { public static void main(String[] args) { String text = "Hello"; System.out.println(new StringBuilder(text).reverse()); } }',
      c: '#include <stdio.h>\n#include <string.h>\nint main(void) { char text[] = "Hello"; for (int i = (int)strlen(text) - 1; i >= 0; i--) putchar(text[i]); return 0; }',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() { string text = "Hello"; reverse(text.begin(), text.end()); cout << text; return 0; }',
      python: 'text = "Hello"\nprint(text[::-1])',
      javascript: 'const text = "Hello";\nconsole.log(text.split("").reverse().join(""));'
    }
  },
  swap: {
    title: "Swap Two Numbers",
    summary: "Use a temporary variable to exchange two values.", output: "a = 10, b = 5",
    examples: {
      java: 'class Main { public static void main(String[] args) { int a = 5, b = 10, temp = a; a = b; b = temp; System.out.println("a = " + a + ", b = " + b); } }',
      c: '#include <stdio.h>\nint main(void) { int a = 5, b = 10, temp = a; a = b; b = temp; printf("a = %d, b = %d", a, b); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int a = 5, b = 10, temp = a; a = b; b = temp; cout << "a = " << a << ", b = " << b; return 0; }',
      python: 'a, b = 5, 10\na, b = b, a\nprint(f"a = {a}, b = {b}")',
      javascript: 'let a = 5, b = 10;\n[a, b] = [b, a];\nconsole.log(`a = ${a}, b = ${b}`);'
    }
  },
  sumNatural: {
    title: "Sum of First N Numbers",
    summary: "Add every number from 1 through n using a loop.", output: "Sum = 15",
    examples: {
      java: 'class Main { public static void main(String[] args) { int n = 5, sum = 0; for (int i = 1; i <= n; i++) sum += i; System.out.println("Sum = " + sum); } }',
      c: '#include <stdio.h>\nint main(void) { int n = 5, sum = 0; for (int i = 1; i <= n; i++) sum += i; printf("Sum = %d", sum); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int n = 5, sum = 0; for (int i = 1; i <= n; i++) sum += i; cout << "Sum = " << sum; return 0; }',
      python: 'n = 5\nprint("Sum =", sum(range(1, n + 1)))',
      javascript: 'const n = 5;\nlet sum = 0;\nfor (let i = 1; i <= n; i++) sum += i;\nconsole.log("Sum =", sum);'
    }
  },
  largestThree: {
    title: "Largest of Three Numbers",
    summary: "Compare three values and print the largest.", output: "Largest = 9",
    examples: {
      java: 'class Main { public static void main(String[] args) { int a = 4, b = 9, c = 6; int largest = Math.max(a, Math.max(b, c)); System.out.println("Largest = " + largest); } }',
      c: '#include <stdio.h>\nint main(void) { int a = 4, b = 9, c = 6, largest = a; if (b > largest) largest = b; if (c > largest) largest = c; printf("Largest = %d", largest); return 0; }',
      cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() { int a = 4, b = 9, c = 6; cout << "Largest = " << max(a, max(b, c)); return 0; }',
      python: 'a, b, c = 4, 9, 6\nprint("Largest =", max(a, b, c))',
      javascript: 'const a = 4, b = 9, c = 6;\nconsole.log("Largest =", Math.max(a, b, c));'
    }
  },
  countDigits: {
    title: "Count Digits",
    summary: "Repeatedly divide an integer by 10 to count its digits.", output: "Digits = 4",
    examples: {
      java: 'class Main { public static void main(String[] args) { int n = 2026, count = 0; do { count++; n /= 10; } while (n != 0); System.out.println("Digits = " + count); } }',
      c: '#include <stdio.h>\nint main(void) { int n = 2026, count = 0; do { count++; n /= 10; } while (n != 0); printf("Digits = %d", count); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int n = 2026, count = 0; do { count++; n /= 10; } while (n != 0); cout << "Digits = " << count; return 0; }',
      python: 'n = 2026\nprint("Digits =", len(str(abs(n))))',
      javascript: 'const n = 2026;\nconsole.log("Digits =", String(Math.abs(n)).length);'
    }
  },
  remainder: {
    title: "Quotient and Remainder",
    summary: "Use division and modulo to split two integers.", output: "Quotient = 3, Remainder = 2",
    examples: {
      java: 'class Main { public static void main(String[] args) { int a = 17, b = 5; System.out.println("Quotient = " + (a / b) + ", Remainder = " + (a % b)); } }',
      c: '#include <stdio.h>\nint main(void) { int a = 17, b = 5; printf("Quotient = %d, Remainder = %d", a / b, a % b); return 0; }',
      cpp: '#include <iostream>\nusing namespace std;\nint main() { int a = 17, b = 5; cout << "Quotient = " << a / b << ", Remainder = " << a % b; return 0; }',
      python: 'a, b = 17, 5\nprint("Quotient =", a // b, ", Remainder =", a % b)',
      javascript: 'const a = 17, b = 5;\nconsole.log("Quotient =", Math.floor(a / b), ", Remainder =", a % b);'
    }
  }

};

function getConceptKey(question) {
  if (!question) return null;
  const id = String(question.id || "").toLowerCase();
  if (id && CONCEPT_EXAMPLES[id]) return id;
  const text = `${question.title || ""} ${question.topic || ""} ${question.question || ""} ${question.description || ""}`.toLowerCase();
  if (/hello world|print.*text|display.*message/.test(text)) return "hello";
  if (/factorial/.test(text)) return "factorial";
  if (/multiplication table|table of/.test(text)) return "table";
  if (/reverse.*string|string.*reverse/.test(text)) return "reverse";
  if (/swap/.test(text)) return "swap";
  if (/sum.*first n|sum of natural|natural number/.test(text)) return "sumNatural";
  if (/largest.*three|three numbers/.test(text)) return "largestThree";
  if (/count.*digit|number of digits/.test(text)) return "countDigits";
  if (/quotient|remainder|modulo/.test(text)) return "remainder";
  if (/sum of two|add.*two numbers/.test(text)) return "sum";
  if (/largest of two|greater number/.test(text)) return "largestTwo";
  if (/positive|negative|zero/.test(text)) return "positiveNegative";
  if (/even or odd|even number|odd number|condition|if-else|if else|greater than|conditional/.test(text)) return "conditionals";
  if (/loop|iteration|repeatedly|repetition|for loop|while loop/.test(text)) return "loops";
  if (/array|list|element|index/.test(text)) return "arrays";
  if (/string|text|character/.test(text)) return "strings";
  if (/function|method|reusable/.test(text)) return "functions";
  if (/variable|data type|assignment|stores a whole number/.test(text)) return "variables";
  return "hello";
}

function MultiLanguageExamples({ conceptKey }) {
  const concept = conceptKey ? CONCEPT_EXAMPLES[conceptKey] : null;
  if (!concept) return null;
  const languages = [
    { id: "java", name: "Java", icon: "☕" },
    { id: "c", name: "C", icon: "C" },
    { id: "cpp", name: "C++", icon: "C+" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "javascript", name: "JavaScript", icon: "JS" }
  ];
  const copyCode = (code) => {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(code).catch(() => {});
  };
  const points = conceptKey === "loops" ? [
    "Used when a task must repeat a number of times.",
    "Initialization, condition and update control the loop.",
    "The same idea uses different syntax in each language."
  ] : conceptKey === "conditionals" ? [
    "The condition is checked before choosing a branch.",
    "Use else for the alternative case.",
    "This sample checks whether a number is even or odd."
  ] : conceptKey === "arrays" ? [
    "An array or list stores multiple values.",
    "A loop can visit each value one by one.",
    "Indexing and syntax vary between languages."
  ] : conceptKey === "functions" ? [
    "Functions group reusable instructions.",
    "Parameters pass values into a function.",
    "A return statement sends a result back."
  ] : conceptKey === "strings" ? [
    "Strings store text.",
    "Quotes define text literals.",
    "Printing syntax differs between languages."
  ] : [
    "A variable stores a value under a name.",
    "Some languages require an explicit type.",
    "This example stores and prints a name."
  ];
  return (
    <aside className="bz-concept-panel bz-all-language-panel">
      <div className="bz-concept-heading"><span className="bz-eyebrow">CONCEPT IN CODE</span><h3>{concept.title} — all languages</h3><p>{concept.summary}</p></div>
      <div className="bz-all-language-grid">
        {languages.map((lang) => <section className="bz-language-example-card" key={lang.id}>
          <div className="bz-language-example-heading"><strong><span className={`bz-language-icon bz-icon-${lang.id}`}>{lang.icon}</span>{lang.name}</strong><button type="button" onClick={() => copyCode(concept.examples[lang.id])} aria-label={`Copy ${lang.name} code`}>▢ Copy</button></div>
          <pre className="bz-example-code"><code>{concept.examples[lang.id]}</code></pre>
        </section>)}
        <section className="bz-language-example-card bz-output-card"><div className="bz-language-example-heading"><strong>▶ Expected output</strong></div><pre className="bz-example-code bz-output-code"><code>{concept.output.replace(/  /g, "\n")}</code></pre></section>
      </div>
      <div className="bz-example-key-points"><strong>💡 Key points</strong><ul>{points.map((point) => <li key={point}>{point}</li>)}</ul></div>
    </aside>
  );
}

const STARTER_CODE = {
  java: 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World" << endl;\n  return 0;\n}',
  python: 'print("Hello World")',
  javascript: 'console.log("Hello World");',
};

const PROGRAMS = [
  { id: "hello", title: "Print Hello World", topic: "Fundamentals", conceptKey: "hello", description: "Print a simple message on the screen.", mcq: { question: "Which Java statement prints text to the console?", options: ["System.out.println(\"Hello World\");", "System.read(\"Hello World\");", "print.line(\"Hello World\");", "Console.input(\"Hello World\");"], answer: 0 } },
  { id: "variables", title: "Variables and Output", topic: "Fundamentals", conceptKey: "variables", description: "Store a name in a variable and display it.", mcq: { question: "What is the main purpose of a variable?", options: ["To repeat code", "To store a value", "To stop a program", "To create a comment"], answer: 1 } },
  { id: "sum", title: "Sum of Two Numbers", topic: "Fundamentals", conceptKey: "sum", description: "Add two numbers and print the result.", mcq: { question: "If a = 7 and b = 5, what is a + b?", options: ["11", "12", "13", "35"], answer: 1 } },
  { id: "even", title: "Even or Odd", topic: "Conditionals", conceptKey: "conditionals", description: "Check whether a number is even or odd.", mcq: { question: "Which expression checks whether n is even?", options: ["n / 2 == 0", "n % 2 == 0", "n * 2 == 0", "n % 2 == 1"], answer: 1 } },
  { id: "largest", title: "Largest of Two Numbers", topic: "Conditionals", conceptKey: "largestTwo", description: "Compare two numbers and print the larger one.", mcq: { question: "If a = 8 and b = 5, which number is larger?", options: ["a", "b", "They are equal", "Cannot compare numbers"], answer: 0 } },
  { id: "positive", title: "Positive, Negative or Zero", topic: "Conditionals", conceptKey: "positiveNegative", description: "Classify a number using if / else if / else.", mcq: { question: "What should a program print when n = 8?", options: ["Negative number", "Zero", "Positive number", "Even only"], answer: 2 } },
  { id: "loops", title: "Print Numbers 1 to 5", topic: "Loops", conceptKey: "loops", description: "Use a loop to print numbers from 1 through 5.", mcq: { question: "How many times does a loop from i = 1 to i <= 5 run?", options: ["4 times", "5 times", "6 times", "Forever"], answer: 1 } },
  { id: "table", title: "Multiplication Table", topic: "Loops", conceptKey: "table", description: "Print the first five multiples of 5.", mcq: { question: "What is the third multiple of 5?", options: ["10", "15", "20", "25"], answer: 1 } },
  { id: "sumNatural", title: "Sum of First N Numbers", topic: "Loops", conceptKey: "sumNatural", description: "Add all numbers from 1 to 5.", mcq: { question: "What is 1 + 2 + 3 + 4 + 5?", options: ["10", "12", "15", "20"], answer: 2 } },
  { id: "factorial", title: "Factorial of a Number", topic: "Loops", conceptKey: "factorial", description: "Calculate 5 factorial using a loop.", mcq: { question: "What is 5 factorial (5!)?", options: ["25", "60", "100", "120"], answer: 3 } },
  { id: "largestThree", title: "Largest of Three Numbers", topic: "Conditionals", conceptKey: "largestThree", description: "Find the largest of 4, 9 and 6.", mcq: { question: "What is the largest number among 4, 9 and 6?", options: ["4", "6", "9", "19"], answer: 2 } },
  { id: "swap", title: "Swap Two Numbers", topic: "Fundamentals", conceptKey: "swap", description: "Exchange the values of two variables.", mcq: { question: "What are a and b after swapping a = 5 and b = 10?", options: ["a = 5, b = 10", "a = 10, b = 5", "a = 15, b = 0", "Both are 5"], answer: 1 } },
  { id: "reverse", title: "Reverse a String", topic: "Strings", conceptKey: "reverse", description: "Reverse the word Hello.", mcq: { question: "What is Hello reversed?", options: ["Hello", "Holle", "olleH", "hello"], answer: 2 } },
  { id: "countDigits", title: "Count Digits", topic: "Numbers", conceptKey: "countDigits", description: "Count the digits in 2026.", mcq: { question: "How many digits are in 2026?", options: ["2", "3", "4", "5"], answer: 2 } },
  { id: "remainder", title: "Quotient and Remainder", topic: "Numbers", conceptKey: "remainder", description: "Find quotient and remainder when 17 is divided by 5.", mcq: { question: "What is the remainder when 17 is divided by 5?", options: ["1", "2", "3", "5"], answer: 1 } },
];


const DSA_PROGRAMS = [
  { id:"dsa-two-sum", title:"Two Sum", topic:"Arrays · Hashing", difficulty:"Easy", conceptKey:"hello", description:"Given an array and a target, find the indices of two numbers that add up to the target.", mcq:{question:"Which data structure gives an average O(1) lookup for this problem?",options:["Stack","Hash map","Queue","Linked list"],answer:1}},
  { id:"dsa-largest", title:"Largest Element in Array", topic:"Arrays", difficulty:"Easy", conceptKey:"hello", description:"Find the largest element in an integer array.", mcq:{question:"What is the time complexity of scanning the entire array once?",options:["O(1)","O(log n)","O(n)","O(n²)"],answer:2}},
  { id:"dsa-smallest", title:"Smallest Element in Array", topic:"Arrays", difficulty:"Easy", conceptKey:"hello", description:"Return the minimum value in an array.", mcq:{question:"Which initial value is safest when finding the minimum?",options:["Always 0","The first array element","Array length","-1 in every case"],answer:1}},
  { id:"dsa-reverse-array", title:"Reverse an Array", topic:"Arrays · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Reverse an array in-place using two pointers.", mcq:{question:"Which approach reverses an array in-place?",options:["Swap left and right elements while moving inward","Sort the array","Use binary search","Only move the left pointer"],answer:0}},
  { id:"dsa-second-largest", title:"Second Largest Element", topic:"Arrays", difficulty:"Easy", conceptKey:"hello", description:"Find the second-largest distinct value in an array.", mcq:{question:"To find the second-largest distinct value in one pass, what should you track?",options:["Only the smallest","Largest and second largest","Only the array length","Only the middle value"],answer:1}},
  { id:"dsa-remove-duplicates", title:"Remove Duplicates from Sorted Array", topic:"Arrays · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Remove duplicate values from a sorted array in-place.", mcq:{question:"Why is the two-pointer method useful here?",options:["It uses sorted order to keep unique values in-place","It sorts an unsorted array automatically","It uses recursion only","It guarantees O(log n) time"],answer:0}},
  { id:"dsa-move-zeroes", title:"Move Zeroes", topic:"Arrays · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Move all zeroes to the end while preserving the order of non-zero values.", mcq:{question:"What must remain unchanged?",options:["Positions of all zeroes","Relative order of non-zero elements","Array length must shrink","Array must be sorted"],answer:1}},
  { id:"dsa-missing-number", title:"Missing Number", topic:"Arrays · Math", difficulty:"Easy", conceptKey:"hello", description:"Find the missing number from the range 0 to n.", mcq:{question:"Which formula gives the sum of integers from 0 through n?",options:["n × (n - 1) / 2","n × (n + 1) / 2","n² + 1","2 × n + 1"],answer:1}},
  { id:"dsa-contains-duplicate", title:"Contains Duplicate", topic:"Arrays · Hashing", difficulty:"Easy", conceptKey:"hello", description:"Determine whether any value appears at least twice.", mcq:{question:"Which structure is a common efficient choice to detect repeats?",options:["Set","Queue only","Call stack only","Binary tree traversal only"],answer:0}},
  { id:"dsa-max-subarray", title:"Maximum Subarray Sum", topic:"Arrays · Kadane's Algorithm", difficulty:"Medium", conceptKey:"hello", description:"Find the maximum sum of a non-empty contiguous subarray.", mcq:{question:"Which algorithm is commonly used for the linear-time solution?",options:["Dijkstra","Kadane's algorithm","BFS","Merge sort"],answer:1}},
  { id:"dsa-best-time-stock", title:"Best Time to Buy and Sell Stock", topic:"Arrays · Greedy", difficulty:"Easy", conceptKey:"hello", description:"Choose one buy day and a later sell day to maximize profit.", mcq:{question:"What should be tracked while scanning prices?",options:["Maximum price only","Minimum price so far and best profit","Only current index","Array's median"],answer:1}},
  { id:"dsa-binary-search", title:"Binary Search", topic:"Searching", difficulty:"Easy", conceptKey:"hello", description:"Find a target in a sorted array using binary search.", mcq:{question:"What is binary search's time complexity on a sorted array?",options:["O(n²)","O(n)","O(log n)","O(1) always"],answer:2}},
  { id:"dsa-first-last", title:"First and Last Position", topic:"Searching · Binary Search", difficulty:"Medium", conceptKey:"hello", description:"Find the first and last index of a target in a sorted array.", mcq:{question:"How can both boundaries be found efficiently?",options:["Run linear search only","Use modified binary search twice","Use bubble sort","Use DFS"],answer:1}},
  { id:"dsa-merge-sorted", title:"Merge Two Sorted Arrays", topic:"Arrays · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Merge two sorted arrays into one sorted result.", mcq:{question:"What is the typical time complexity when merging arrays of lengths m and n?",options:["O(m + n)","O(m × n)","O(log m)","O(1)"],answer:0}},
  { id:"dsa-rotate-array", title:"Rotate Array", topic:"Arrays", difficulty:"Medium", conceptKey:"hello", description:"Rotate an array to the right by k positions.", mcq:{question:"Before rotating by k, why is k often reduced modulo n?",options:["To sort the array","To handle rotations larger than the array length","To remove duplicates","To avoid using indexes"],answer:1}},
  { id:"dsa-product-except-self", title:"Product of Array Except Self", topic:"Arrays · Prefix/Suffix", difficulty:"Medium", conceptKey:"hello", description:"Return an array where each position contains the product of all other elements.", mcq:{question:"Which technique can solve this without division?",options:["Prefix and suffix products","Binary search","BFS","Selection sort"],answer:0}},
  { id:"dsa-valid-anagram", title:"Valid Anagram", topic:"Strings · Hashing", difficulty:"Easy", conceptKey:"hello", description:"Check whether two strings contain the same characters with the same frequencies.", mcq:{question:"What should match for two lowercase strings to be anagrams?",options:["Their first characters","Character frequency counts","Their lengths only","Their alphabetical order before sorting only"],answer:1}},
  { id:"dsa-palindrome-string", title:"Valid Palindrome", topic:"Strings · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Check whether a string is a palindrome, ignoring non-alphanumeric characters and case.", mcq:{question:"Which approach compares characters from both ends?",options:["Two pointers","BFS","Heap","Prefix sum"],answer:0}},
  { id:"dsa-first-unique", title:"First Unique Character", topic:"Strings · Hashing", difficulty:"Easy", conceptKey:"hello", description:"Return the index of the first character that appears once.", mcq:{question:"What is a useful first step?",options:["Count each character's frequency","Sort and discard all characters","Reverse the string twice","Build a graph"],answer:0}},
  { id:"dsa-longest-substring", title:"Longest Substring Without Repeating Characters", topic:"Strings · Sliding Window", difficulty:"Medium", conceptKey:"hello", description:"Find the length of the longest substring with all unique characters.", mcq:{question:"Which pattern is commonly used for an efficient solution?",options:["Sliding window","Bubble sort","Postorder traversal","Union only"],answer:0}},
  { id:"dsa-valid-parentheses", title:"Valid Parentheses", topic:"Stack", difficulty:"Easy", conceptKey:"hello", description:"Check whether brackets are correctly opened and closed in the right order.", mcq:{question:"Which data structure is best suited for matching the most recent opening bracket?",options:["Queue","Stack","Min-heap","Hash-only sorting"],answer:1}},
  { id:"dsa-implement-queue", title:"Implement Queue Using Stacks", topic:"Stack · Queue", difficulty:"Medium", conceptKey:"hello", description:"Implement FIFO queue operations using stacks.", mcq:{question:"What does FIFO mean?",options:["First In, First Out","First In, Final Out","Fast Input, Fast Output","First Index, First Operation"],answer:0}},
  { id:"dsa-min-stack", title:"Min Stack", topic:"Stack", difficulty:"Medium", conceptKey:"hello", description:"Design a stack that supports push, pop, top and retrieving the minimum in constant time.", mcq:{question:"A common way to make getMin O(1) is to maintain what?",options:["A sorted copy after every operation only","An auxiliary stack of minimums","A queue of all values","A graph"],answer:1}},
  { id:"dsa-linked-list-reverse", title:"Reverse a Linked List", topic:"Linked List", difficulty:"Easy", conceptKey:"hello", description:"Reverse the links in a singly linked list.", mcq:{question:"Which three references are commonly used in iterative reversal?",options:["prev, current, next","front, rear, size","root, left, right","low, mid, high"],answer:0}},
  { id:"dsa-linked-list-cycle", title:"Linked List Cycle", topic:"Linked List · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Detect whether a linked list contains a cycle.", mcq:{question:"Which algorithm uses slow and fast pointers?",options:["Floyd's cycle detection","Kadane's algorithm","Kruskal's algorithm","Counting sort"],answer:0}},
  { id:"dsa-merge-lists", title:"Merge Two Sorted Linked Lists", topic:"Linked List", difficulty:"Easy", conceptKey:"hello", description:"Merge two sorted linked lists into one sorted list.", mcq:{question:"At each step, which node should be linked next?",options:["The smaller current node","Always the second list node","The last node in either list","A random node"],answer:0}},
  { id:"dsa-middle-list", title:"Middle of Linked List", topic:"Linked List · Two Pointers", difficulty:"Easy", conceptKey:"hello", description:"Find the middle node of a linked list in one pass.", mcq:{question:"How do slow and fast pointers find the middle?",options:["Both move one node at a time","Slow moves one node, fast moves two","Fast moves backward","Slow jumps to the end"],answer:1}},
  { id:"dsa-binary-tree-inorder", title:"Binary Tree Inorder Traversal", topic:"Trees · DFS", difficulty:"Easy", conceptKey:"hello", description:"Traverse a binary tree in left-root-right order.", mcq:{question:"What is the order for inorder traversal?",options:["Root-left-right","Left-root-right","Left-right-root","Right-root-left only"],answer:1}},
  { id:"dsa-tree-level-order", title:"Binary Tree Level Order Traversal", topic:"Trees · BFS", difficulty:"Medium", conceptKey:"hello", description:"Visit tree nodes level by level from left to right.", mcq:{question:"Which data structure is normally used for level-order traversal?",options:["Queue","Stack only","Min-heap only","Hash set only"],answer:0}},
  { id:"dsa-max-depth", title:"Maximum Depth of Binary Tree", topic:"Trees · DFS", difficulty:"Easy", conceptKey:"hello", description:"Compute the maximum number of nodes on a root-to-leaf path.", mcq:{question:"For a node, how is depth commonly computed recursively?",options:["1 + max(left depth, right depth)","left depth × right depth","left depth - right depth","Always 1"],answer:0}},
  { id:"dsa-bst-search", title:"Search in a Binary Search Tree", topic:"Trees · BST", difficulty:"Easy", conceptKey:"hello", description:"Search for a value in a binary search tree.", mcq:{question:"If the target is smaller than the current node, where do you go?",options:["Right subtree","Left subtree","Always root","Stop immediately"],answer:1}},
  { id:"dsa-number-islands", title:"Number of Islands", topic:"Graphs · DFS/BFS", difficulty:"Medium", conceptKey:"hello", description:"Count connected groups of land cells in a grid.", mcq:{question:"What is a standard way to explore each connected island?",options:["DFS or BFS","Binary search","Heap sort","Sliding window only"],answer:0}},
  { id:"dsa-graph-bfs", title:"Breadth-First Search", topic:"Graphs · BFS", difficulty:"Easy", conceptKey:"hello", description:"Traverse a graph level by level from a starting vertex.", mcq:{question:"Which structure supports BFS traversal order?",options:["Queue","Stack only","Priority queue always","Array sorting"],answer:0}},
  { id:"dsa-graph-dfs", title:"Depth-First Search", topic:"Graphs · DFS", difficulty:"Easy", conceptKey:"hello", description:"Explore a graph as deeply as possible before backtracking.", mcq:{question:"DFS is commonly implemented using recursion or which structure?",options:["Stack","Queue only","Deque sorted by value","Hash map only"],answer:0}},
  { id:"dsa-topological-sort", title:"Course Schedule / Topological Sort", topic:"Graphs · Topological Sort", difficulty:"Medium", conceptKey:"hello", description:"Determine whether course prerequisites form a valid ordering.", mcq:{question:"Topological ordering applies to which kind of graph?",options:["Directed acyclic graph","Undirected complete graph only","Any graph with a cycle","A linked list only"],answer:0}},
  { id:"dsa-heap-kth", title:"Kth Largest Element", topic:"Heap · Quickselect", difficulty:"Medium", conceptKey:"hello", description:"Find the kth largest value in an unsorted array.", mcq:{question:"Which data structure is useful for keeping the k largest values seen so far?",options:["Min-heap of size k","Queue of size one","Stack only","Trie only"],answer:0}},
  { id:"dsa-merge-sort", title:"Merge Sort", topic:"Sorting", difficulty:"Medium", conceptKey:"hello", description:"Sort an array using divide and conquer.", mcq:{question:"What is merge sort's typical time complexity?",options:["O(n²)","O(n log n)","O(log n)","O(1)"],answer:1}},
  { id:"dsa-quick-sort", title:"Quick Sort", topic:"Sorting", difficulty:"Medium", conceptKey:"hello", description:"Sort an array using pivot-based partitioning.", mcq:{question:"What is quicksort's average time complexity?",options:["O(n log n)","O(n²) always","O(log n)","O(1)"],answer:0}},
  { id:"dsa-insertion-sort", title:"Insertion Sort", topic:"Sorting", difficulty:"Easy", conceptKey:"hello", description:"Sort a small array by inserting each element into its correct position in the sorted prefix.", mcq:{question:"What is insertion sort's worst-case time complexity?",options:["O(log n)","O(n)","O(n²)","O(1)"],answer:2}},
  { id:"dsa-recursion-factorial", title:"Factorial Using Recursion", topic:"Recursion", difficulty:"Easy", conceptKey:"hello", description:"Compute n! recursively with a correct base case.", mcq:{question:"What is a necessary part of a recursive solution?",options:["Base case","Infinite loop","Global variable always","Sorting first"],answer:0}},
  { id:"dsa-fibonacci", title:"Fibonacci Number", topic:"Recursion · Dynamic Programming", difficulty:"Easy", conceptKey:"hello", description:"Return the nth Fibonacci number.", mcq:{question:"Why can plain recursive Fibonacci be slow?",options:["It repeats many subproblems","It uses no function calls","It always runs in O(1)","It sorts the result"],answer:0}},
  { id:"dsa-climbing-stairs", title:"Climbing Stairs", topic:"Dynamic Programming", difficulty:"Easy", conceptKey:"hello", description:"Count ways to reach step n when you can climb one or two steps.", mcq:{question:"Which recurrence describes the number of ways to reach step n?",options:["ways[n] = ways[n-1] + ways[n-2]","ways[n] = n² only","ways[n] = ways[n] - 1","ways[n] = 2n always"],answer:0}},
  { id:"dsa-house-robber", title:"House Robber", topic:"Dynamic Programming", difficulty:"Medium", conceptKey:"hello", description:"Maximize the sum of non-adjacent values.", mcq:{question:"At each house, which choice is considered?",options:["Rob it plus best two houses back, or skip it","Always rob every house","Sort the values and take the first","Use BFS"],answer:0}},
  { id:"dsa-coin-change", title:"Coin Change", topic:"Dynamic Programming", difficulty:"Medium", conceptKey:"hello", description:"Find the minimum number of coins needed to make a target amount, or report impossible.", mcq:{question:"What does a typical DP state dp[x] represent?",options:["Minimum coins needed to make amount x","Number of array indexes","Maximum graph degree","Sorted position of x"],answer:0}},
  { id:"dsa-subset-sum", title:"Subset Sum", topic:"Dynamic Programming", difficulty:"Medium", conceptKey:"hello", description:"Determine whether a subset of numbers can sum to a target.", mcq:{question:"What makes subset sum a dynamic programming problem?",options:["Choices depend on earlier reachable sums","It always needs sorting only","It has no repeated states","It is a graph traversal by definition"],answer:0}},
  { id:"dsa-permutations", title:"Generate Permutations", topic:"Backtracking", difficulty:"Medium", conceptKey:"hello", description:"Generate all arrangements of the input values.", mcq:{question:"What does backtracking do after exploring one choice?",options:["Undo the choice and explore another","Stop after the first choice always","Sort the input repeatedly","Delete all previous states"],answer:0}},
  { id:"dsa-combination-sum", title:"Combination Sum", topic:"Backtracking", difficulty:"Medium", conceptKey:"hello", description:"Find combinations that sum to a target, reusing allowed candidates as specified.", mcq:{question:"Why is backtracking useful for combination problems?",options:["It explores choices and prunes invalid paths","It guarantees O(1) time","It avoids all recursion","It only works on sorted strings"],answer:0}},
  { id:"dsa-lru-cache", title:"LRU Cache", topic:"Hashing · Linked List", difficulty:"Hard", conceptKey:"hello", description:"Design a cache with O(1) average get and put operations and least-recently-used eviction.", mcq:{question:"Which combination is commonly used for O(1) LRU operations?",options:["Hash map + doubly linked list","Queue + binary search","Stack + merge sort","Trie + DFS"],answer:0}},
  { id:"dsa-trapping-rain", title:"Trapping Rain Water", topic:"Arrays · Two Pointers", difficulty:"Hard", conceptKey:"hello", description:"Calculate how much water can be trapped between elevation bars.", mcq:{question:"What information determines water above a position?",options:["Left maximum and right maximum boundaries","Only the current height","Array length alone","The sum of all heights only"],answer:0}},
  { id:"dsa-median-two-arrays", title:"Median of Two Sorted Arrays", topic:"Binary Search", difficulty:"Hard", conceptKey:"hello", description:"Find the median of two sorted arrays in logarithmic time.", mcq:{question:"What is the target time complexity for the optimal solution?",options:["O(m + n)","O(m × n)","O(log(min(m,n)))","O(n²)"],answer:2}},
  { id:"dsa-word-ladder", title:"Word Ladder", topic:"Graphs · BFS", difficulty:"Hard", conceptKey:"hello", description:"Find the shortest transformation sequence between two words using valid intermediate words.", mcq:{question:"Why is BFS appropriate for the shortest sequence when every transformation has equal cost?",options:["It explores states by increasing number of steps","It always uses less memory than DFS","It sorts all words","It only visits one node"],answer:0}},
  { id:"dsa-dijkstra", title:"Dijkstra's Shortest Path", topic:"Graphs · Greedy", difficulty:"Medium", conceptKey:"hello", description:"Find shortest distances from a source in a graph with non-negative edge weights.", mcq:{question:"Dijkstra's algorithm assumes edge weights are:",options:["All negative","Non-negative","All equal to zero","Strings"],answer:1}},
  { id:"dsa-union-find", title:"Number of Connected Components", topic:"Graphs · Union-Find", difficulty:"Medium", conceptKey:"hello", description:"Count connected components by joining vertices connected by edges.", mcq:{question:"Which data structure supports efficient union and find operations?",options:["Disjoint Set Union (DSU)","Queue only","Stack only","Prefix sum"],answer:0}}
];

const ALL_PROGRAMS = [
  ...PROGRAMS.map((program) => ({ difficulty: "Easy", ...program })),
  ...DSA_PROGRAMS
];

const DAILY_CHALLENGES = [
  { id: "sum-two", title: "Sum of Two Numbers", difficulty: "Easy", points: 10, topic: "Fundamentals", statement: "Read two integers and print their sum.", input: "7 5", output: "12", hint: "Read two values, add them, then print the result." },
  { id: "even-odd", title: "Even or Odd", difficulty: "Easy", points: 10, topic: "Conditionals", statement: "Read an integer. Print Even if it is divisible by 2; otherwise print Odd.", input: "8", output: "Even", hint: "Use the remainder operator (%)." },
  { id: "largest-three", title: "Largest of Three", difficulty: "Easy", points: 15, topic: "Conditionals", statement: "Read three integers and print the largest number.", input: "4 9 6", output: "9", hint: "Compare all three values, or use a built-in maximum function." },
  { id: "count-to-n", title: "Count from 1 to N", difficulty: "Easy", points: 10, topic: "Loops", statement: "Read N and print the numbers from 1 to N, each on a new line.", input: "5", output: "1\n2\n3\n4\n5", hint: "Use a loop that starts at 1 and ends at N." },
  { id: "factorial", title: "Factorial", difficulty: "Medium", points: 20, topic: "Loops", statement: "Read a non-negative integer N and print N factorial. For 0, print 1.", input: "5", output: "120", hint: "Start the product at 1 and multiply by each number from 1 through N." },
  { id: "reverse-string", title: "Reverse a String", difficulty: "Easy", points: 15, topic: "Strings", statement: "Read a single word and print it in reverse order.", input: "hello", output: "olleh", hint: "Walk through the characters from the end to the beginning." },
  { id: "sum-array", title: "Sum of Array", difficulty: "Medium", points: 20, topic: "Arrays", statement: "Read N followed by N integers, then print their sum.", input: "5\n1 2 3 4 5", output: "15", hint: "Keep a running total as you read each value." },
  { id: "positive-negative", title: "Positive, Negative or Zero", difficulty: "Easy", points: 10, topic: "Conditionals", statement: "Read an integer and print Positive, Negative, or Zero.", input: "-3", output: "Negative", hint: "Compare the value with zero." },
  { id: "multiplication-table", title: "Multiplication Table", difficulty: "Easy", points: 10, topic: "Loops", statement: "Read N and print its multiplication table from 1 to 5, one result per line.", input: "3", output: "3\n6\n9\n12\n15", hint: "Multiply N by each number from 1 through 5." },
  { id: "count-vowels", title: "Count Vowels", difficulty: "Easy", points: 10, topic: "Strings", statement: "Read a lowercase word and print how many vowels it contains.", input: "education", output: "5", hint: "Check each character against a, e, i, o, and u." },
  { id: "digit-sum", title: "Sum of Digits", difficulty: "Easy", points: 10, topic: "Numbers", statement: "Read a non-negative integer and print the sum of its digits.", input: "1234", output: "10", hint: "Use % 10 to get the last digit and / 10 to remove it." },
  { id: "palindrome-number", title: "Palindrome Number", difficulty: "Easy", points: 15, topic: "Numbers", statement: "Print Yes if the given number reads the same backwards, otherwise print No.", input: "121", output: "Yes", hint: "Reverse the digits and compare with the original number." },
  { id: "max-array", title: "Maximum in an Array", difficulty: "Easy", points: 15, topic: "Arrays", statement: "Read N and N integers, then print the maximum value.", input: "5\n2 9 1 7 4", output: "9", hint: "Track the largest value seen so far." },
  { id: "linear-search", title: "Linear Search", difficulty: "Easy", points: 15, topic: "Arrays", statement: "Read N, N integers, and target X. Print the zero-based index of X, or -1 if missing.", input: "5\n4 8 2 9 6\n9", output: "3", hint: "Check each array item until the target is found." },
  { id: "second-largest", title: "Second Largest Distinct", difficulty: "Medium", points: 20, topic: "Arrays", statement: "Read N and N integers. Print the second-largest distinct value. Assume it exists.", input: "5\n4 9 9 6 2", output: "6", hint: "Track the largest and second-largest distinct values." },
  { id: "fibonacci", title: "Fibonacci Number", difficulty: "Medium", points: 20, topic: "Loops", statement: "Read N and print the Nth Fibonacci number using F(0)=0 and F(1)=1.", input: "7", output: "13", hint: "Build the sequence by adding the previous two values." },
  { id: "remove-spaces", title: "Remove Spaces", difficulty: "Medium", points: 20, topic: "Strings", statement: "Read a line and print it with all space characters removed.", input: "code mentor ai", output: "codementorai", hint: "Build a result using only non-space characters." },
  { id: "frequency-target", title: "Count Target Frequency", difficulty: "Medium", points: 20, topic: "Arrays", statement: "Read N, N integers, and X. Print how many times X appears.", input: "6\n2 3 2 5 2 7\n2", output: "3", hint: "Increase a counter whenever an item equals X." },
  { id: "gcd", title: "Greatest Common Divisor", difficulty: "Medium", points: 20, topic: "Math", statement: "Read two positive integers and print their GCD.", input: "18 24", output: "6", hint: "Use the Euclidean algorithm: repeatedly replace (a,b) with (b,a%b)." },
  { id: "valid-brackets", title: "Balanced Parentheses", difficulty: "Medium", points: 25, topic: "Stack", statement: "Input contains only '(' and ')'. Print Yes if parentheses are balanced, otherwise No.", input: "(()())", output: "Yes", hint: "Track the balance; it must never go negative and must finish at zero." },
  { id: "binary-search", title: "Binary Search", difficulty: "Medium", points: 25, topic: "Searching", statement: "Given a sorted array, N, its values and target X, print the zero-based index or -1.", input: "5\n1 3 5 7 9\n7", output: "3", hint: "Compare the target with the middle element and discard half each step." },
  { id: "two-sum", title: "Two Sum", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N, N integers, and target T. Print Yes if any two different elements sum to T; otherwise No.", input: "5\n2 7 11 15 1\n9", output: "Yes", hint: "A simple nested loop can check every pair." },
  { id: "merge-sorted", title: "Merge Two Sorted Arrays", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read lengths N and M followed by two sorted arrays. Print all values in sorted order.", input: "3 3\n1 4 7\n2 3 8", output: "1 2 3 4 7 8", hint: "Use two pointers, one for each array." },
  { id: "anagram", title: "Check Anagram", difficulty: "Medium", points: 25, topic: "Strings", statement: "Read two lowercase words. Print Yes if they contain the same letters with the same frequencies.", input: "listen silent", output: "Yes", hint: "Compare sorted characters or character-frequency counts." },
  { id: "missing-number", title: "Missing Number", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N then N-1 distinct values from 1 to N. Print the missing value.", input: "5\n1 2 4 5", output: "3", hint: "Subtract the actual sum from N*(N+1)/2." },
  { id: "move-zeros", title: "Move Zeros to End", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N integers and print them with all zeros moved to the end, preserving other order.", input: "5\n0 1 0 3 12", output: "1 3 12 0 0", hint: "First output non-zero values, then the zeros." },
  { id: "longest-word", title: "Longest Word", difficulty: "Medium", points: 25, topic: "Strings", statement: "Read a line of words separated by spaces and print the longest word. If tied, print the first.", input: "code mentor platform", output: "platform", hint: "Split the line and keep the first word with the greatest length." },
  { id: "two-sum-indices", title: "Two Sum Indices", difficulty: "Hard", points: 30, topic: "Hashing", statement: "Read N, N integers, and target T. Print the two zero-based indices of a pair that sums to T. Assume one solution exists.", input: "4\n2 7 11 15\n9", output: "0 1", hint: "Store previously seen values and their indices in a map." },
  { id: "longest-unique", title: "Longest Unique Substring", difficulty: "Hard", points: 35, topic: "Strings", statement: "Read a string and print the length of its longest substring without repeated characters.", input: "abcabcbb", output: "3", hint: "Use a sliding window and remember each character's last position." },
  { id: "subarray-sum", title: "Subarray Sum Equals K", difficulty: "Hard", points: 35, topic: "Arrays", statement: "Read N, target K, then N integers. Print the number of contiguous subarrays whose sum equals K.", input: "5 3\n1 2 1 2 1", output: "4", hint: "Prefix sums with a frequency map handle negative values too." },
  { id: "valid-brackets-stack", title: "Validate Brackets", difficulty: "Hard", points: 35, topic: "Stack", statement: "Given a string containing (), [], and {}, print Yes if brackets are correctly nested, otherwise No.", input: "{[()]}", output: "Yes", hint: "Push opening brackets onto a stack and match each closing bracket." },
  { id: "rotate-array", title: "Rotate Array Right", difficulty: "Hard", points: 35, topic: "Arrays", statement: "Read N, K, and N integers. Rotate the array right by K positions and print it.", input: "5 2\n1 2 3 4 5", output: "4 5 1 2 3", hint: "Reduce K modulo N, then use reversal or indexing." },
  { id: "majority-element", title: "Majority Element", difficulty: "Hard", points: 35, topic: "Arrays", statement: "Read N integers. Print the value appearing more than N/2 times. Assume it exists.", input: "5\n2 2 1 2 3", output: "2", hint: "Boyer-Moore voting finds it in linear time and constant extra space." },
  { id: "is-prime", title: "Prime Number", difficulty: "Easy", points: 10, topic: "Math", statement: "Read an integer N and print Prime or Not Prime.", input: "17", output: "Prime", hint: "Try divisors only up to the square root of N." },
  { id: "binary-to-decimal", title: "Binary to Decimal", difficulty: "Medium", points: 20, topic: "Math", statement: "Read a binary number as a string and print its decimal value.", input: "1011", output: "11", hint: "For each bit, multiply the accumulated value by 2 and add the bit." },
  { id: "deduplicate", title: "Remove Duplicates", difficulty: "Medium", points: 25, topic: "Arrays", statement: "Read N integers and print distinct values in their first-seen order.", input: "6\n1 2 1 3 2 4", output: "1 2 3 4", hint: "Track seen values while preserving the original order." },
  { id: "max-subarray", title: "Maximum Subarray Sum", difficulty: "Hard", points: 40, topic: "Dynamic Programming", statement: "Read N integers and print the maximum sum of a non-empty contiguous subarray.", input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", hint: "Kadane's algorithm decides whether to extend or restart the current subarray." },
];

const CHALLENGE_STARTERS = {
  "sum-two": {
    java: 'import java.util.Scanner;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    // Write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  int a, b;\n  scanf("%d %d", &a, &b);\n  // Write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int a, b;\n  cin >> a >> b;\n  // Write your solution here\n  return 0;\n}',
    python: 'a, b = map(int, input().split())\n# Write your solution here',
    javascript: 'const fs = require("fs");\nconst [a, b] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\n// Write your solution here'
  },
  "even-odd": {
    java: 'import java.util.Scanner;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // Write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  int n; scanf("%d", &n);\n  // Write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n; cin >> n;\n  // Write your solution here\n  return 0;\n}',
    python: 'n = int(input())\n# Write your solution here',
    javascript: 'const fs = require("fs");\nconst n = Number(fs.readFileSync(0, "utf8").trim());\n// Write your solution here'
  },
  "largest-three": {
    java: 'import java.util.Scanner;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n    // Write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  int a, b, c; scanf("%d %d %d", &a, &b, &c);\n  // Write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n  int a, b, c; cin >> a >> b >> c;\n  // Write your solution here\n  return 0;\n}',
    python: 'a, b, c = map(int, input().split())\n# Write your solution here',
    javascript: 'const fs = require("fs");\nconst [a, b, c] = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\n// Write your solution here'
  }
};

function challengeStarter(challengeId, lang) {
  if (CHALLENGE_STARTERS[challengeId]?.[lang]) return CHALLENGE_STARTERS[challengeId][lang];
  const generic = {
    java: 'import java.util.*;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    // Read input and write your solution here\n  }\n}',
    c: '#include <stdio.h>\nint main(void) {\n  // Read input and write your solution here\n  return 0;\n}',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  // Read input and write your solution here\n  return 0;\n}',
    python: '# Read input and write your solution here',
    javascript: 'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim();\n// Write your solution here'
  };
  return generic[lang];
}

const DAILY_START_DATE = "2026-10-18";
function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function dayNumberSinceStart(date = new Date()) {
  const start = new Date(`${DAILY_START_DATE}T00:00:00`);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000));
}
function getStreakStats(history = {}, now = new Date()) {
  const solvedDates = new Set(Object.keys(history).filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key)));
  const sorted = [...solvedDates].sort();
  let longest = 0;
  let run = 0;
  let previous = null;
  for (const key of sorted) {
    const date = new Date(`${key}T00:00:00`);
    const diff = previous ? Math.round((date - previous) / 86400000) : 0;
    run = previous && diff === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }
  const todayKey = localDateKey(now);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!solvedDates.has(todayKey)) {
    if (!solvedDates.has(localDateKey(yesterday))) return { current: 0, longest, solvedDates };
    cursor = yesterday;
  }
  let current = 0;
  while (solvedDates.has(localDateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest, solvedDates };
}
function getTodayChallenge() {
  const day = dayNumberSinceStart();
  const base = DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
  const difficulty = day < 10 ? "Easy" : day < 20 ? "Medium" : "Hard";
  const points = difficulty === "Easy" ? 10 : difficulty === "Medium" ? 20 : 35;
  return { ...base, difficulty, points, dayNumber: day + 1 };
}


const GUIDED_MODULES = [
  {
    id: "dbms", title: "DBMS", icon: "🗄️", level: "Beginner", duration: "15 min",
    tagline: "Understand how applications store and organize data.",
    notes: [
      ["What is a DBMS?", "A Database Management System is software that helps create, store, search, update and protect data. Examples include MySQL, PostgreSQL and Oracle."],
      ["Why do we use it?", "It keeps data organized, reduces unnecessary duplication, supports multiple users and helps control access to information."],
      ["Important terms", "A table stores related records. A row is one record. A column describes one property. A primary key uniquely identifies a row; a foreign key links related tables."],
      ["Remember", "SQL is the language commonly used to ask a relational database to read or change data. DBMS is the software; SQL is the language used to work with it."]
    ],
    visualTitle: "How an app uses a database",
    visual: ["Student app", "DBMS", "Students table"],
    quiz: { question: "What is the main purpose of a DBMS?", options: ["Design web page colors", "Manage and organize data", "Compile Java code", "Connect a keyboard"], answer: 1, explanation: "A DBMS stores, organizes, retrieves and manages data safely." },
    practiceType: "sql", practiceTitle: "Find students with marks above 80", practicePrompt: "Write a query that returns the name column from the Students table where marks are greater than 80.", starter: `SELECT name\nFROM Students\nWHERE marks > 80;`, solution: "SELECT name FROM Students WHERE marks > 80;",
    related: ["What is the difference between a primary key and a foreign key?", "Why is normalization used?", "What does a JOIN do?", "Explain ACID properties in a transaction."],
    points: ["A DBMS manages data.", "Tables contain rows and columns.", "Primary keys identify rows; foreign keys create relationships."]
  },
  {
    id: "oops", title: "OOPs", icon: "🧩", level: "Beginner", duration: "12 min",
    tagline: "Learn to organize programs using classes and objects.",
    notes: [["Class and object", "A class is a blueprint. An object is an instance created from that blueprint."], ["Four pillars", "Encapsulation protects state, abstraction hides unnecessary details, inheritance reuses behavior, and polymorphism lets one interface have different implementations."], ["Why it helps", "OOP makes larger programs easier to organize, reuse, test and maintain." ]],
    visualTitle: "Class → Object → Behavior", visual: ["Class: Car", "Object: myCar", "Method: drive()"],
    quiz: { question: "Which OOP concept lets a class reuse behavior from another class?", options: ["Inheritance", "Compilation", "Normalization", "Iteration"], answer: 0, explanation: "Inheritance lets a subclass reuse or extend behavior from a parent class." },
    practiceType: "java", practiceTitle: "Create a simple class", practicePrompt: "Write a Java class named Student and print the text Student ready.", starter: `class Main {\n  public static void main(String[] args) {\n    System.out.println("Student ready");\n  }\n}`, solution: "Student ready",
    related: ["What is encapsulation?", "Overloading vs overriding", "What is a constructor?", "Explain abstraction with an example."],
    points: ["Class is a blueprint.", "Object is an instance.", "The four pillars are abstraction, encapsulation, inheritance and polymorphism."]
  },
  {
    id: "sql", title: "SQL", icon: "💾", level: "Beginner", duration: "15 min",
    tagline: "Ask questions of data using simple SQL queries.",
    notes: [["What is SQL?", "SQL stands for Structured Query Language. It is used to retrieve and modify data in relational databases."], ["SELECT and WHERE", "SELECT chooses columns. FROM chooses the table. WHERE filters rows using a condition."], ["Next steps", "After the basics, learn INSERT, UPDATE, DELETE, ORDER BY, GROUP BY and JOIN." ]],
    visualTitle: "A query filters table rows", visual: ["Students table", "WHERE marks > 80", "Matching rows"],
    quiz: { question: "Which SQL clause filters rows?", options: ["ORDER BY", "WHERE", "SELECT", "CREATE"], answer: 1, explanation: "WHERE keeps only rows that satisfy a condition." },
    practiceType: "sql", practiceTitle: "Filter students by marks", practicePrompt: "Return all columns from Students where marks are at least 60.", starter: `SELECT *\nFROM Students\nWHERE marks >= 60;`, solution: "SELECT * FROM Students WHERE marks >= 60;",
    related: ["Write a query to sort marks in descending order.", "When would you use GROUP BY?", "Explain INNER JOIN.", "What is the difference between DELETE and DROP?"],
    points: ["SELECT chooses columns.", "FROM chooses the table.", "WHERE filters rows."]
  },
  {
    id: "os", title: "Operating Systems", icon: "💻", level: "Beginner", duration: "12 min",
    tagline: "Understand how the operating system manages a computer.",
    notes: [["What is an OS?", "An operating system manages hardware and provides services to programs. Examples include Windows, Linux, Android and macOS."], ["Core responsibilities", "It manages processes, memory, files, devices, permissions and scheduling."], ["Process vs program", "A program is stored instructions; a process is a program currently being executed." ]],
    visualTitle: "Program execution", visual: ["Program", "Operating system", "Running process"],
    quiz: { question: "What is a process?", options: ["A program in execution", "A folder name", "A database key", "A network cable"], answer: 0, explanation: "A process is an instance of a program that is currently executing." },
    practiceType: "text", practiceTitle: "Explain process vs program", practicePrompt: "In your own words, write one or two sentences explaining the difference between a program and a process.", starter: `A program is ...\nA process is ...`, solution: "A program is a set of stored instructions. A process is a running instance of a program.",
    related: ["What is deadlock?", "What is virtual memory?", "Process vs thread", "What is CPU scheduling?"],
    points: ["The OS manages resources.", "A process is a running program.", "Memory and CPU scheduling are core OS topics."]
  },
  {
    id: "cn", title: "Computer Networks", icon: "🌐", level: "Beginner", duration: "12 min",
    tagline: "Learn how devices communicate and exchange data.",
    notes: [["What is a network?", "A computer network connects devices so they can exchange information and share resources."], ["Protocols", "Protocols are agreed rules for communication. HTTP/HTTPS are used for web traffic; TCP provides reliable transport; IP helps route packets."], ["Addressing", "An IP address identifies a device/interface on an IP network. DNS translates domain names into IP addresses." ]],
    visualTitle: "Opening a website", visual: ["Browser", "DNS + network", "Web server"],
    quiz: { question: "What does DNS mainly do?", options: ["Stores Java variables", "Translates domain names to IP addresses", "Creates database tables", "Schedules CPU processes"], answer: 1, explanation: "DNS helps find the IP address associated with a domain name." },
    practiceType: "text", practiceTitle: "Trace a web request", practicePrompt: "Write the basic steps that happen when you enter a website name in a browser.", starter: `1. Browser ...\n2. DNS ...\n3. Server ...`, solution: "The browser resolves the domain using DNS, connects to the server, sends a request and displays the response.",
    related: ["TCP vs UDP", "What is an IP address?", "HTTP vs HTTPS", "What is the purpose of a router?"],
    points: ["Protocols define communication rules.", "DNS resolves domain names.", "Routers forward traffic between networks."]
  },
  {
    id: "aptitude", title: "Aptitude", icon: "🧠", level: "Beginner", duration: "10 min",
    tagline: "Build a strong base in placement aptitude.",
    notes: [["What to learn first", "Start with percentages, ratios, averages, number systems, time and work, speed and distance, and basic probability."], ["Solve systematically", "Write down the given values, identify what is asked, choose a formula, calculate carefully and verify the answer."], ["Practice habit", "Focus on accuracy first, then improve speed with timed sets." ]],
    visualTitle: "A simple problem-solving loop", visual: ["Read", "Choose method", "Calculate + verify"],
    quiz: { question: "What is 20% of 150?", options: ["15", "20", "30", "50"], answer: 2, explanation: "20% of 150 = 0.20 × 150 = 30." },
    practiceType: "text", practiceTitle: "Explain your calculation", practicePrompt: "Write the steps for calculating 15% of 200.", starter: "15% of 200 = ...", solution: "15% of 200 = 15/100 × 200 = 30.",
    related: ["A product costs ₹800 after a 20% discount. What was the original price?", "Find the average of 12, 18 and 24.", "A ratio is 2:3 and the total is 25. Find both parts."],
    points: ["Convert percentages to fractions or decimals.", "Write down the known values.", "Verify the answer before moving on."]
  }
];

function getUserStorageKey() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id || user?._id;
    return `codementor_beginner_zone_v1_${userId || "guest"}`;
  } catch {
    return "codementor_beginner_zone_v1_guest";
  }
}

function readSaved(storageKey) {
  try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
  catch { return {}; }
}

export default function BeginnerZone() {
  const storageKey = getUserStorageKey();
  const [language, setLanguage] = useState("java");
  const [activeSubject, setActiveSubject] = useState("java");
  const [showPlacementQuestions, setShowPlacementQuestions] = useState(false);
  const [section, setSection] = useState("Guided Learning");
  const [saved, setSaved] = useState(() => readSaved(storageKey));
  const [topicFilter, setTopicFilter] = useState("All topics");
  const [mcqIndex, setMcqIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [code, setCode] = useState(STARTER_CODE.java);
  const [customInput, setCustomInput] = useState("");
  const [runOutput, setRunOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [programMode, setProgramMode] = useState("mcq");
  const [activeProgram, setActiveProgram] = useState(ALL_PROGRAMS[0]);
  const [programAnswer, setProgramAnswer] = useState(null);
  const [programSearch, setProgramSearch] = useState("");
  const [programDifficulty, setProgramDifficulty] = useState("All");
  const [roadmapName, setRoadmapName] = useState("");
  const [roadmapTopic, setRoadmapTopic] = useState(TOPICS.java[0]);
  const [roadmapLanguage, setRoadmapLanguage] = useState("java");
  const [customRoadmaps, setCustomRoadmaps] = useState(() => readSaved(storageKey).customRoadmaps || []);
  const [guidedModuleId, setGuidedModuleId] = useState("dbms");
  const [guidedStage, setGuidedStage] = useState("modules");
  const [guidedAnswer, setGuidedAnswer] = useState(null);
  const [guidedQuizChecked, setGuidedQuizChecked] = useState(false);
  const [guidedPracticeText, setGuidedPracticeText] = useState("");
  const [guidedPracticeFeedback, setGuidedPracticeFeedback] = useState("");
  const [guidedPracticeDone, setGuidedPracticeDone] = useState(false);
  const [guidedRelatedIndex, setGuidedRelatedIndex] = useState(null);
  const [guidedRelatedAnswer, setGuidedRelatedAnswer] = useState("");
  const [guidedRelatedFeedback, setGuidedRelatedFeedback] = useState("");


  const isPlacementSubject = PLACEMENT_SUBJECTS.some(
  (subject) => subject.id === activeSubject
);

const topics = isPlacementSubject
  ? [...new Set((MCQS[activeSubject] || []).map((q) => q.topic))]
  : TOPICS[activeSubject];

const mcqs = MCQS[activeSubject] || [];
  const completed = saved.completed || {};
  const attempts = saved.attempts || {};
  const completedCount = Object.keys(completed).filter((key) => completed[key]).length;
  const totalQuestions = Object.values(MCQS).reduce((n, list) => n + list.length, 0) + PROGRAMS.length;
  const answeredCount = Object.keys(attempts).length;
  const correctCount = Object.values(attempts).filter(Boolean).length;
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
  // The Overview roadmap tracks placement subjects, including Cloud Computing.
  const overviewTopics = PLACEMENT_SUBJECTS.map((subject) => subject.name);
  const topicProgress = useMemo(() => PLACEMENT_SUBJECTS.map((subject, i) => {
    const questions = MCQS[subject.id] || [];
    const answeredCountForSubject = questions.filter(
      (q) => Object.prototype.hasOwnProperty.call(attempts, `${subject.id}:${q.id}`)
    ).length;
    const pct = questions.length
      ? Math.round((answeredCountForSubject / questions.length) * 100)
      : 0;
    return {
      topic: subject.name,
      subjectId: subject.id,
      pct,
      number: i + 1,
      questionCount: questions.length,
    };
  }), [completed, attempts]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ ...saved, customRoadmaps }));
  }, [saved, customRoadmaps, storageKey]);

  useEffect(() => {
    setCode(STARTER_CODE[language]);
    setMcqIndex(0); setSelectedAnswer(null); setShowExplanation(false);
    setTopicFilter("All topics"); setRunOutput("");
  }, [language]);

  // A subject change starts a fresh quiz state so answers never carry over between subjects.
  useEffect(() => {
    setTopicFilter("All topics");
    setMcqIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [activeSubject]);

  const filteredMcqs = mcqs.filter((q) => topicFilter === "All topics" || q.topic === topicFilter);
  const safeMcqIndex = Math.min(mcqIndex, Math.max(filteredMcqs.length - 1, 0));
  const currentMcq = filteredMcqs[safeMcqIndex];
  const correctAnswerIndex = currentMcq
  ? typeof currentMcq.answer === "number"
    ? currentMcq.answer
    : currentMcq.options.findIndex(
        (option) => option === currentMcq.answer
      )
  : -1;

  const currentConceptKey = getConceptKey(currentMcq);
  const guidedModule = GUIDED_MODULES.find((module) => module.id === guidedModuleId) || GUIDED_MODULES[0];

  function openGuidedModule(module) {
    setGuidedModuleId(module.id);
    setGuidedStage("notes");
    setGuidedAnswer(null);
    setGuidedQuizChecked(false);
    setGuidedPracticeText(module.starter || "");
    setGuidedPracticeFeedback("");
    setGuidedPracticeDone(false);
    setGuidedRelatedIndex(null);
    setGuidedRelatedAnswer("");
    setGuidedRelatedFeedback("");
  }

  function checkGuidedQuiz() {
    if (guidedAnswer === null) return;
    setGuidedQuizChecked(true);
  }

  async function checkGuidedPractice() {
    const typed = guidedPracticeText.trim();
    if (!typed) {
      setGuidedPracticeFeedback("Write your answer first, then check it.");
      return;
    }

    if (guidedModule.practiceType === "sql") {
      const normalized = typed.toLowerCase().replace(/[;\s]+/g, " ").trim();
      const required = guidedModule.id === "dbms"
        ? ["select name", "from students", "where marks > 80"]
        : ["select *", "from students", "where marks >= 60"];
      const passed = required.every((part) => normalized.includes(part));
      setGuidedPracticeDone(passed);
      setGuidedPracticeFeedback(passed
        ? "Great! Your query includes the required SELECT, FROM and WHERE parts."
        : "Not quite yet. Check the requested columns, table name and WHERE condition, then try again.");
      if (passed) {
        setSaved((prev) => ({ ...prev, guidedCompleted: { ...(prev.guidedCompleted || {}), [guidedModule.id]: true } }));
      }
      return;
    }

    if (guidedModule.practiceType === "java") {
      setRunning(true);
      setGuidedPracticeFeedback("Submitting your Java code to the compiler…");
      try {
        const response = await axios.post("http://localhost:5000/api/run", {
          code: typed,
          language: "java",
          input: "",
        }, { timeout: 25000 });
        const output = String(response.data.output || response.data.error || response.data.message || "").trim();
        const passed = Boolean(response.data.success) && output.includes("Student ready");
        setGuidedPracticeDone(passed);
        setGuidedPracticeFeedback(passed ? "Nice work! Your program ran and produced the expected output." : `Compiler result: ${output || "No output returned."}`);
        if (passed) setSaved((prev) => ({ ...prev, guidedCompleted: { ...(prev.guidedCompleted || {}), [guidedModule.id]: true } }));
      } catch (error) {
        setGuidedPracticeFeedback(error.response?.data?.message || error.message || "Compiler request failed. Check that the backend is running.");
      } finally {
        setRunning(false);
      }
      return;
    }

    const meaningful = typed.length >= 20;
    setGuidedPracticeDone(meaningful);
    setGuidedPracticeFeedback(meaningful
      ? "Answer saved. Compare your explanation with the key idea below, then try the related questions."
      : "Add a little more detail (at least one or two complete sentences), then check again.");
    if (meaningful) setSaved((prev) => ({ ...prev, guidedCompleted: { ...(prev.guidedCompleted || {}), [guidedModule.id]: true } }));
  }


  function recordAttempt(id, isCorrect) {
    setSaved((prev) => ({ ...prev, attempts: { ...(prev.attempts || {}), [id]: isCorrect } }));
  }

  function answerMcq() {
  if (selectedAnswer === null || !currentMcq) return;

  const correctAnswerIndex =
    typeof currentMcq.answer === "number"
      ? currentMcq.answer
      : currentMcq.options.findIndex(
          (option) => option === currentMcq.answer
        );

  const correct = selectedAnswer === correctAnswerIndex;

  recordAttempt(`${activeSubject}:${currentMcq.id}`, correct);

  if (correct) {
    setSaved((prev) => ({
      ...prev,
      completed: {
        ...(prev.completed || {}),
        [`${activeSubject}:${currentMcq.topic}`]: true,
      },
    }));
  }

  setShowExplanation(true);
}

  function nextMcq() {
    setMcqIndex((i) => (i + 1) % Math.max(filteredMcqs.length, 1));
    setSelectedAnswer(null);
    setShowExplanation(false);
  }

  async function runProgram() {
    if (language !== "java") {
      setRunOutput(`The current backend runner supports Java only. The ${LANGUAGES.find((l) => l.id === language)?.name} editor is ready in the UI, but backend execution must be added for this language.`);
      return;
    }
    setRunning(true); setRunOutput("Running your code…");
    try {
      const response = await axios.post("http://localhost:5000/api/run", { code, language, input: customInput });
      setRunOutput(response.data.output || response.data.error || (response.data.success ? "Program finished successfully." : "Execution failed."));
      if (response.data.success) setSaved((prev) => ({ ...prev, completed: { ...(prev.completed || {}), [`${language}:${activeProgram.topic}`]: true } }));
    } catch (error) {
      setRunOutput(error.response?.data?.message || "Could not connect to the backend. Make sure the server is running.");
    } finally { setRunning(false); }
  }


  function createRoadmap(e) {
    e.preventDefault();
    if (!roadmapName.trim()) return;
    const newRoadmap = { id: Date.now(), name: roadmapName.trim(), language: roadmapLanguage, topics: [roadmapTopic], completed: [] };
    setCustomRoadmaps((prev) => [...prev, newRoadmap]);
    setRoadmapName("");
  }

  function toggleRoadmapTopic(id, topic) {
    setCustomRoadmaps((prev) => prev.map((r) => r.id !== id ? r : ({ ...r, completed: r.completed.includes(topic) ? r.completed.filter((t) => t !== topic) : [...r.completed, topic] })));
  }

  // Browser Back first returns from inline MCQs to the subject cards.
  useEffect(() => {
    const marker = "bz-placement-inline-mcqs";
    const pushMarker = () => window.history.pushState({ [marker]: true }, "");
    const handlePopState = () => {
      if (section === "Placement Practice" && showPlacementQuestions) {
        setShowPlacementQuestions(false);
        pushMarker();
      } else if (section !== "Overview") {
        setSection("Guided Learning");
        setShowPlacementQuestions(false);
        pushMarker();
      } else {
        pushMarker();
      }
    };
    pushMarker();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [section, showPlacementQuestions]);

  return (
    <div className="bz-page">
      <div className="bz-hero">
        <div>
          <span className="bz-eyebrow">YOUR LEARNING SPACE</span>
          <h1>Beginner Zone <span>✦</span></h1>
          <p>Build strong fundamentals, practice a little every day, and track your progress across languages.</p>
        </div>
        <label className="bz-language-picker">Learning language
          <select value={language} onChange={(e) => { setLanguage(e.target.value); setActiveSubject(e.target.value); }}>
            {LANGUAGES.map((l) => <option value={l.id} key={l.id}>{l.icon} {l.name}</option>)}
          </select>
        </label>
      </div>

        <div className="bz-stat-grid">
          <article className="bz-stat-card"><span className="bz-stat-icon purple">↗</span><p>Overall progress</p><strong>{Math.round(topicProgress.reduce((sum, topic) => sum + topic.pct, 0) / Math.max(1, topicProgress.length))}%</strong><div className="bz-progress-track"><i style={{ width: `${Math.round(topicProgress.reduce((sum, topic) => sum + topic.pct, 0) / Math.max(1, topicProgress.length))}%` }} /></div><small>Across placement subjects</small></article>
          <article className="bz-stat-card"><span className="bz-stat-icon blue">✓</span><p>Questions attempted</p><strong>{answeredCount}<em> / {totalQuestions}</em></strong><small>Keep the momentum going</small></article>
          <article className="bz-stat-card"><span className="bz-stat-icon green">◎</span><p>Accuracy</p><strong>{accuracy}%</strong><small>{correctCount} correct answers recorded</small></article>
          <article className="bz-stat-card"><span className="bz-stat-icon orange">⚡</span><p>Topics started</p><strong>{topicProgress.filter((t) => t.pct > 0).length}<em> / {PLACEMENT_SUBJECTS.length}</em></strong><small>Placement subjects started</small></article>
        </div>

      <div className="bz-section-tabs">
        {["Guided Learning", "Overview", "Placement Practice", "Basic Coding", "My Roadmaps"].map((tab) => <button key={tab} className={(section === tab || (tab === "Placement Practice" && section === "MCQ Practice")) ? "active" : ""} onClick={() => { setSection(tab); if (tab !== "Placement Practice") setShowPlacementQuestions(false); if (tab === "Guided Learning") setGuidedStage("modules"); }}>{tab === "Guided Learning" ? "✦" : tab === "Overview" ? "▦" : tab === "Placement Practice" ? "☑" : tab === "Basic Coding" ? "⌘" : "♧"} <span>{tab === "Guided Learning" ? "Learn Modules" : tab}</span></button>)}
      </div>

      {section === "Guided Learning" && <section className="bz-guided-wrap">
        <div className="bz-guided-intro"><div><span className="bz-eyebrow">LEARN IN SMALL STEPS</span><h2>Learn a concept. See it. Practice it.</h2><p>Choose a module, read the short notes, understand the visual, answer a quick check, and then try a hands-on task.</p></div><div className="bz-guided-step-strip"><span>01 Notes</span><i /> <span>02 Quick check</span><i /> <span>03 Practice</span></div></div>
        {guidedStage === "modules" ? <div className="bz-guided-module-grid">{GUIDED_MODULES.map((module) => { const done = Boolean((saved.guidedCompleted || {})[module.id]); return <button type="button" className="bz-guided-module-card" key={module.id} onClick={() => openGuidedModule(module)}><span className="bz-guided-module-icon">{module.icon}</span><span className="bz-guided-card-top"><span className="bz-pill">{module.level}</span><span className={done ? "bz-guided-done" : "bz-guided-not-started"}>{done ? "✓ Completed" : module.duration}</span></span><strong>{module.title}</strong><p>{module.tagline}</p><span className="bz-guided-card-bottom">{done ? "Review module" : "Start learning"} <b>→</b></span></button>; })}</div> : <>
          <div className="bz-guided-back-row"><button type="button" className="bz-text-button" onClick={() => setGuidedStage("modules")}>← All modules</button><span className="bz-pill">{guidedModule.icon} {guidedModule.title}</span><span className="bz-guided-stage-label">{guidedStage === "notes" ? "Step 1 of 3 · Learn" : guidedStage === "quiz" ? "Step 2 of 3 · Check" : "Step 3 of 3 · Practice"}</span></div>
          {guidedStage === "notes" && <div className="bz-guided-lesson-grid"><article className="bz-guided-notes-card"><span className="bz-eyebrow">THE BASICS</span><h2>{guidedModule.title}: quick notes</h2><p className="bz-guided-lead">{guidedModule.tagline}</p><div className="bz-guided-note-list">{guidedModule.notes.map(([title, body], index) => <div className="bz-guided-note" key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div><div className="bz-guided-takeaways"><strong>Remember these</strong><ul>{guidedModule.points.map((point) => <li key={point}>{point}</li>)}</ul></div><button type="button" className="bz-primary" onClick={() => { setGuidedStage("quiz"); setGuidedAnswer(null); setGuidedQuizChecked(false); }}>I understand — quick check →</button></article><aside className="bz-guided-visual-card"><span className="bz-eyebrow">CONCEPT VISUAL</span><h3>{guidedModule.visualTitle}</h3><p>A simple view of how the pieces fit together.</p><div className="bz-guided-diagram">{guidedModule.visual.map((item, index) => <div className="bz-guided-diagram-step" key={item}><div className={`bz-guided-diagram-node node-${index}`}>{index === 0 ? "▣" : index === 1 ? "↔" : "▤"}<strong>{item}</strong></div>{index < guidedModule.visual.length - 1 && <div className="bz-guided-arrow" aria-hidden="true">↓</div>}</div>)}</div><div className="bz-guided-visual-caption">Read the notes first, then use this visual to remember the flow.</div></aside></div>}
          {guidedStage === "quiz" && <article className="bz-guided-quiz-card"><span className="bz-eyebrow">QUICK KNOWLEDGE CHECK</span><h2>{guidedModule.title}: check your understanding</h2><p>Choose one answer. You can review the notes if you need help.</p><h3>{guidedModule.quiz.question}</h3><div className="bz-guided-quiz-options">{guidedModule.quiz.options.map((option, index) => <button type="button" key={option} disabled={guidedQuizChecked} className={`${guidedAnswer === index ? "selected" : ""} ${guidedQuizChecked && index === guidedModule.quiz.answer ? "correct" : ""} ${guidedQuizChecked && guidedAnswer === index && index !== guidedModule.quiz.answer ? "incorrect" : ""}`} onClick={() => setGuidedAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{guidedQuizChecked && index === guidedModule.quiz.answer && <b>✓</b>}</button>)}</div>{guidedQuizChecked && <div className={`bz-guided-feedback ${guidedAnswer === guidedModule.quiz.answer ? "success" : "warning"}`}><strong>{guidedAnswer === guidedModule.quiz.answer ? "Correct — ready to practice!" : "Not quite. Review this idea."}</strong><p>{guidedModule.quiz.explanation}</p></div>}<div className="bz-guided-actions"><button type="button" className="bz-secondary" onClick={() => setGuidedStage("notes")}>← Review notes</button>{!guidedQuizChecked ? <button type="button" className="bz-primary" disabled={guidedAnswer === null} onClick={checkGuidedQuiz}>Check answer</button> : guidedAnswer === guidedModule.quiz.answer ? <button type="button" className="bz-primary" onClick={() => { setGuidedStage("practice"); setGuidedPracticeText(guidedModule.starter); setGuidedPracticeFeedback(""); setGuidedPracticeDone(false); }}>Continue to practice →</button> : <button type="button" className="bz-primary" onClick={() => { setGuidedAnswer(null); setGuidedQuizChecked(false); }}>Try again</button>}</div></article>}
          {guidedStage === "practice" && <div className="bz-guided-practice-layout"><article className="bz-guided-practice-card"><span className="bz-eyebrow">HANDS-ON PRACTICE</span><h2>{guidedModule.practiceTitle}</h2><p>{guidedModule.practicePrompt}</p>{guidedModule.practiceType === "java" ? <><div className="bz-editor-title"><span>main.java</span><span>Java</span></div><Editor height="300px" language="java" theme="vs-dark" value={guidedPracticeText} onChange={(value) => { setGuidedPracticeText(value ?? ""); setGuidedPracticeDone(false); }} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, scrollBeyondLastLine: false, wordWrap: "on" }} /><p className="bz-guided-hint">Use the Run/check button to submit your Java solution to the existing backend compiler.</p></> : <><textarea className="bz-guided-answer-editor" value={guidedPracticeText} onChange={(e) => { setGuidedPracticeText(e.target.value); setGuidedPracticeDone(false); }} rows={8} spellCheck="false" aria-label="Write your practice answer" /><p className="bz-guided-hint">{guidedModule.practiceType === "sql" ? "Write your SQL query. This first version checks the required query structure locally; it does not connect to a live SQL database." : "Write your explanation in your own words. You can compare it with the key idea after checking."}</p></>}<div className="bz-guided-actions"><button type="button" className="bz-secondary" onClick={() => setGuidedStage("quiz")}>← Back to quiz</button><button type="button" className="bz-primary" onClick={checkGuidedPractice} disabled={running}>{guidedModule.practiceType === "java" ? "▶ Run & check" : "Check my answer"}</button></div>{guidedPracticeFeedback && <div className={`bz-guided-feedback ${guidedPracticeDone ? "success" : "warning"}`}><strong>{guidedPracticeDone ? "Practice passed" : "Keep going"}</strong><p>{guidedPracticeFeedback}</p></div>}{guidedPracticeDone && <div className="bz-guided-solution"><strong>Key idea / expected result</strong><pre>{guidedModule.solution}</pre><p>Module completed and your progress has been saved in this browser.</p></div>}</article><aside className="bz-guided-related-card"><span className="bz-eyebrow">AFTER THIS MODULE</span><h3>Related questions</h3><p>Complete the task to unlock these follow-up questions.</p>{guidedModule.related.map((question, index) => <button type="button" className={`bz-guided-related-item ${guidedPracticeDone ? "unlocked" : "locked"} ${guidedRelatedIndex === index ? "active" : ""}`} key={question} disabled={!guidedPracticeDone} onClick={() => { setGuidedRelatedIndex(index); setGuidedRelatedAnswer((saved.guidedRelatedAnswers || {})[`${guidedModule.id}:${index}`] || ""); setGuidedRelatedFeedback(""); }}><span>{String(index + 1).padStart(2, "0")}</span><p>{question}</p>{guidedPracticeDone && <span className="bz-guided-open-label">Practice →</span>}</button>)}{guidedPracticeDone && guidedRelatedIndex !== null && <div className="bz-guided-related-editor"><strong>Try question {guidedRelatedIndex + 1}</strong><p>{guidedModule.related[guidedRelatedIndex]}</p><textarea rows={5} value={guidedRelatedAnswer} onChange={(e) => { setGuidedRelatedAnswer(e.target.value); setGuidedRelatedFeedback(""); }} placeholder="Write your answer or solution here..." /><button type="button" className="bz-primary" onClick={() => { if (!guidedRelatedAnswer.trim()) { setGuidedRelatedFeedback("Write your answer before saving."); return; } setSaved((prev) => ({ ...prev, guidedRelatedAnswers: { ...(prev.guidedRelatedAnswers || {}), [`${guidedModule.id}:${guidedRelatedIndex}`]: guidedRelatedAnswer } })); setGuidedRelatedFeedback("Answer saved in this browser. Review the notes and improve it as you learn."); }}>Save answer</button>{guidedRelatedFeedback && <p className="bz-guided-related-feedback">{guidedRelatedFeedback}</p>}</div>}{guidedPracticeDone && <button type="button" className="bz-primary bz-guided-finish-button" onClick={() => setGuidedStage("modules")}>Back to modules →</button>}</aside></div>}
        </>}
      </section>}

      {section === "Placement Practice" && <>
      <section className="bz-placement-section" aria-labelledby="bz-placement-heading">
        <div className="bz-placement-heading">
          <div>
            <span className="bz-control-label">CAREER PREPARATION</span>
            <h2 id="bz-placement-heading">Placement Practice</h2>
            <p>Build job-ready knowledge with focused practice across key subjects.</p>
          </div>
          <span className="bz-placement-count">{PLACEMENT_SUBJECTS.length} subjects</span>
        </div>
        <div className="bz-placement-grid" role="group" aria-label="Placement subjects">
          {PLACEMENT_SUBJECTS.map((subject) => {
            const questionCount = (MCQS[subject.id] || []).length;
            return (
              <button
                type="button"
                key={subject.id}
                className={`bz-placement-card ${activeSubject === subject.id ? "selected" : ""}`}
                aria-pressed={activeSubject === subject.id}
                onClick={() => {
                  setActiveSubject(subject.id);
                  setSection("Placement Practice");
                  setShowPlacementQuestions(true);
                  setTopicFilter("All topics");
                  setMcqIndex(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setTimeout(() => document.getElementById("bz-placement-mcqs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                }}
              >
                <span className="bz-placement-card-icon" aria-hidden="true">{subject.icon}</span>
                <span className="bz-placement-card-content">
                  <strong>{subject.name}</strong>
                  <span>{({
                    oops: "Core object-oriented programming concepts",
                    dbms: "Databases, keys, normalization and transactions",
                    sql: "Queries, filtering, joins and aggregation",
                    cn: "Networking models, protocols and devices",
                    os: "Processes, memory and scheduling",
                    aptitude: "Quantitative reasoning and problem solving",
                  })[subject.id]}</span>
                  <span className="bz-placement-card-meta">{questionCount} practice questions <span aria-hidden="true">→</span></span>
                </span>
              </button>
            );
          })}
        </div>
        {showPlacementQuestions && (
          <section id="bz-placement-mcqs" className="bz-panel bz-practice-panel bz-inline-placement-mcqs">
            <div className="bz-panel-heading">
              <div>
                <span className="bz-eyebrow">SUBJECT PRACTICE</span>
                <h2>{PLACEMENT_SUBJECTS.find((subject) => subject.id === activeSubject)?.name || "Placement Practice"} MCQs</h2>
                <p>Answer questions below. Your selected subject cards will stay visible above.</p>
              </div>
              <button type="button" className="bz-text-button" onClick={() => setShowPlacementQuestions(false)}>Hide questions ↑</button>
            </div>
            <div className="bz-filters"><span>Question {filteredMcqs.length ? safeMcqIndex + 1 : 0} of {filteredMcqs.length}</span></div>
            {currentMcq ? (
              <div className="bz-question-layout">
                <div className="bz-question-card">
                  <span className="bz-question-topic">{currentMcq.topic}</span>
                  <h3>{currentMcq.question}</h3>
                  <div className="bz-options">
                    {currentMcq.options.map((option, i) => (
                      <button type="button" key={`${activeSubject}-${currentMcq.id}-${i}`}
                        disabled={showExplanation}
                        className={`bz-option ${selectedAnswer === i ? "chosen" : ""} ${showExplanation && i === correctAnswerIndex ? "correct" : ""} ${showExplanation && selectedAnswer === i && i !== correctAnswerIndex ? "incorrect" : ""}`}
                        onClick={() => setSelectedAnswer(i)}>
                        <span>{String.fromCharCode(65 + i)}</span>{option}
                        {showExplanation && i === correctAnswerIndex && <b>✓</b>}
                      </button>
                    ))}
                  </div>
                  {showExplanation && <div className={`bz-explanation ${selectedAnswer === correctAnswerIndex ? "right" : "wrong"}`}>
                    <strong>{selectedAnswer === correctAnswerIndex ? "Correct! Nicely done." : "Not quite — keep learning."}</strong>
                    <p>{currentMcq.explanation}</p>
                  </div>}
                  <div className="bz-question-actions">
                    <small>Your progress is saved in this browser.</small>
                    {showExplanation
                      ? <button className="bz-primary" onClick={nextMcq}>Next question →</button>
                      : <button className="bz-primary" disabled={selectedAnswer === null} onClick={answerMcq}>Check answer</button>}
                  </div>
                </div>
              </div>
            ) : <p>No questions are available for this subject yet.</p>}
          </section>
        )}
      </section>
      </>}




      {section === "Overview" && <>
        <div className="bz-dashboard-grid">
          
          <section className="bz-panel bz-next-panel"><div className="bz-panel-heading"><div><h2>Pick up where you left off</h2><p>A small step today adds up.</p></div></div><div className="bz-next-icon">🎯</div><h3>{PLACEMENT_SUBJECTS.find((subject) => (MCQS[subject.id] || []).some((q) => !Object.prototype.hasOwnProperty.call(attempts, `${subject.id}:${q.id}`)))?.name || "Placement Practice"}</h3><p>Continue with focused MCQs and track your progress by subject.</p><button className="bz-primary" onClick={() => { const nextSubject = PLACEMENT_SUBJECTS.find((subject) => (MCQS[subject.id] || []).some((q) => !Object.prototype.hasOwnProperty.call(attempts, `${subject.id}:${q.id}`))) || PLACEMENT_SUBJECTS[0]; setActiveSubject(nextSubject.id); setTopicFilter("All topics"); setSection("MCQ Practice"); setMcqIndex(0); setSelectedAnswer(null); setShowExplanation(false); }}>Continue practice <span>→</span></button></section>
        </div>

        <section className="bz-panel bz-roadmap-panel"><div className="bz-panel-heading"><div><h2>Placement subject progress</h2><p>Track your MCQ progress across placement subjects, including Cloud Computing.</p></div><button className="bz-text-button" onClick={() => setSection("MCQ Practice")}>Start practice ↗</button></div>
          <div className="bz-roadmap-list">{PLACEMENT_SUBJECTS.map((subject, i) => {
            const item = topicProgress[i];
            const pct = item?.pct || 0;
            const subjectQuestions = MCQS[subject.id] || [];
            const answered = subjectQuestions.filter((q) => Object.prototype.hasOwnProperty.call(attempts, `${subject.id}:${q.id}`)).length;
            return <div className="bz-roadmap-item" key={subject.id}>
              <div className={`bz-step-number ${pct === 100 ? "done" : ""}`}>{pct === 100 ? "✓" : String(i + 1).padStart(2, "0")}</div>
              <div className="bz-roadmap-info">
                <div className="bz-roadmap-title"><strong>{subject.icon} {subject.name}</strong><span className={`bz-status ${pct === 100 ? "complete" : pct ? "progress" : "not-started"}`}>{pct === 100 ? "Completed" : pct ? "In progress" : "Not started"}</span></div>
                <div className="bz-progress-track"><i style={{ width: `${pct}%` }} /></div>
              </div>
              <span className="bz-roadmap-percent">{answered}/{subjectQuestions.length}</span>
              <b className="bz-roadmap-percent">{pct}%</b>
              <button className="bz-icon-button" title={`Practice ${subject.name}`} aria-label={`Practice ${subject.name}`} onClick={() => { setActiveSubject(subject.id); setTopicFilter("All topics"); setSection("MCQ Practice"); setMcqIndex(0); setSelectedAnswer(null); setShowExplanation(false); }}>→</button>
            </div>;
          })}</div>
        </section>
      </>}

      {section === "MCQ Practice" && <section className="bz-panel bz-practice-panel"><div className="bz-panel-heading"><div><span className="bz-eyebrow">QUICK PRACTICE</span><h2>MCQ Practice</h2><p>Check your understanding with syllabus-based questions.</p></div><span className="bz-pill">{mcqs.length} questions</span></div><div className="bz-filters"><span>Question {filteredMcqs.length ? safeMcqIndex + 1 : 0} of {filteredMcqs.length}</span></div>{currentMcq ? <div className="bz-question-layout"><div className="bz-question-card"><span className="bz-question-topic">{currentMcq.topic}</span><h3>{currentMcq.question}</h3><div className="bz-options">{currentMcq.options.map((option, i) => <button type="button" key={`${activeSubject}-${currentMcq.id}-${i}`} disabled={showExplanation} className={`bz-option ${selectedAnswer === i ? "chosen" : ""} ${showExplanation && i === correctAnswerIndex ? "correct" : ""} ${showExplanation && selectedAnswer === i && i !== correctAnswerIndex ? "incorrect" : ""}`} onClick={() => setSelectedAnswer(i)}><span>{String.fromCharCode(65 + i)}</span>{option}{showExplanation && i === correctAnswerIndex && <b>✓</b>}</button>)}</div>{showExplanation && <div className={`bz-explanation ${selectedAnswer === correctAnswerIndex ? "right" : "wrong"}`}><strong>{selectedAnswer === correctAnswerIndex ? "Correct! Nicely done." : "Not quite — keep learning."}</strong><p>{currentMcq.explanation}</p></div>}<div className="bz-question-actions"><small>Your progress is saved in this browser.</small>{showExplanation ? <button className="bz-primary" onClick={nextMcq}>Next question →</button> : <button className="bz-primary" disabled={selectedAnswer === null} onClick={answerMcq}>Check answer</button>}</div></div></div> : <p>No questions are available for this topic yet. Try another topic.</p>}</section>}

      {section === "Basic Coding" && <section className="bz-panel bz-programs-panel"><div className="bz-panel-heading"><div><span className="bz-eyebrow">LEARN BY DOING</span><h2>Basic Coding</h2><p>Learn common beginner programs with questions, code examples in five languages, and expected output.</p></div><span className="bz-pill">Beginner · {LANGUAGES.find((l) => l.id === language)?.name}</span></div><div className="bz-program-layout bz-program-layout-refined"><aside className="bz-program-list bz-program-list-refined" aria-label="Coding and DSA practice questions"><div className="bz-program-list-heading"><strong>Practice questions</strong><span>{ALL_PROGRAMS.filter((program) => (saved.attempts || {})[program.id]).length}/{ALL_PROGRAMS.length} completed</span></div><div className="bz-program-filters"><input type="search" value={programSearch} onChange={(e) => setProgramSearch(e.target.value)} placeholder="Search DSA questions..." aria-label="Search coding questions" /><select value={programDifficulty} onChange={(e) => setProgramDifficulty(e.target.value)} aria-label="Filter by difficulty"><option value="All">All levels</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select></div>{ALL_PROGRAMS.filter((program) => (program.title + " " + program.topic).toLowerCase().includes(programSearch.toLowerCase()) && (programDifficulty === "All" || program.difficulty === programDifficulty)).map((program) => <button type="button" key={program.id} className={`bz-program-item ${activeProgram.id === program.id ? "selected" : ""} ${(saved.attempts || {})[program.id] ? "completed" : ""}`} onClick={() => { setActiveProgram(program); setProgramAnswer(null); setRunOutput(""); setProgramMode("mcq"); }}><span className="bz-program-check">{(saved.attempts || {})[program.id] ? "✓" : "○"}</span><span><strong>{program.title}</strong><small>{program.topic}</small><span className={`bz-difficulty bz-difficulty-${program.difficulty.toLowerCase()}`}>{program.difficulty}</span></span></button>)}</aside><div className="bz-program-work bz-program-work-refined"><div className="bz-program-work-heading"><div><span className="bz-eyebrow">SELECTED QUESTION</span><h3>{activeProgram.title}</h3></div><div className="bz-selected-badges"><span className="bz-pill">{activeProgram.topic}</span><span className={`bz-difficulty bz-difficulty-${activeProgram.difficulty.toLowerCase()}`}>{activeProgram.difficulty}</span></div></div><p>{activeProgram.description}</p><div className="bz-program-learning-layout"><div className="bz-program-question-side"><div className="bz-mode-switch"><button className={programMode === "mcq" ? "active" : ""} onClick={() => setProgramMode("mcq")}>Quick MCQ</button><button className={programMode === "code" ? "active" : ""} onClick={() => setProgramMode("code")}>Write code</button></div>{programMode === "mcq" ? <div className="bz-program-mcq"><strong>{activeProgram.mcq.question}</strong><div className="bz-options">{activeProgram.mcq.options.map((option, i) => <button type="button" key={`${activeProgram.id}-${i}`} className={`bz-option ${programAnswer === i ? "chosen" : ""} ${programAnswer !== null && i === activeProgram.mcq.answer ? "correct" : ""} ${programAnswer === i && programAnswer !== activeProgram.mcq.answer ? "incorrect" : ""}`} onClick={() => { setProgramAnswer(i); if (i === activeProgram.mcq.answer) setSaved((prev) => ({ ...prev, attempts: { ...(prev.attempts || {}), [activeProgram.id]: true }, completed: { ...(prev.completed || {}), [`${language}:${activeProgram.topic}`]: true } })); }}><span>{String.fromCharCode(65 + i)}</span>{option}{programAnswer !== null && i === activeProgram.mcq.answer && <b>✓</b>}</button>)}</div>{programAnswer !== null && <p className={`bz-inline-feedback ${programAnswer === activeProgram.mcq.answer ? "right" : "wrong"}`}>{programAnswer === activeProgram.mcq.answer ? "Correct answer! Topic progress updated." : "Not quite. Check the highlighted correct option and try to understand why."}</p>}</div> : <div className="bz-code-work"><div className="bz-editor-title"><span>main</span><span>{LANGUAGES.find((l) => l.id === language)?.name}</span></div><Editor height="300px" language={language === "cpp" ? "cpp" : language === "javascript" ? "javascript" : language} theme="vs-dark" value={code} onChange={(value) => setCode(value ?? "")} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, scrollBeyondLastLine: false, wordWrap: "on" }} /><label className="bz-input-label">Custom input <textarea rows="2" value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Optional input for your program" /></label><button className="bz-primary" onClick={runProgram} disabled={running}>{running ? "Running…" : "▶ Run code"}</button>{runOutput && <div className="bz-output"><strong>Output</strong><pre>{runOutput}</pre></div>}</div>}</div><div className="bz-program-example-side"><MultiLanguageExamples key={activeProgram.conceptKey || activeProgram.id} conceptKey={activeProgram.conceptKey || "hello"} /></div></div></div></div></section>}



      {section === "My Roadmaps" && <section className="bz-panel bz-custom-panel"><div className="bz-panel-heading"><div><span className="bz-eyebrow">YOUR PLAN, YOUR PACE</span><h2>My custom roadmaps</h2><p>Create a focused plan for a language or topic you want to prepare.</p></div></div><form className="bz-roadmap-form" onSubmit={createRoadmap}><label>Roadmap name<input value={roadmapName} onChange={(e) => setRoadmapName(e.target.value)} placeholder="e.g. Java interview basics" required /></label><label>Language<select value={roadmapLanguage} onChange={(e) => { setRoadmapLanguage(e.target.value); setRoadmapTopic(TOPICS[e.target.value][0]); }}>{LANGUAGES.map((l) => <option value={l.id} key={l.id}>{l.name}</option>)}</select></label><label>First topic<select value={roadmapTopic} onChange={(e) => setRoadmapTopic(e.target.value)}>{TOPICS[roadmapLanguage].map((t) => <option key={t}>{t}</option>)}</select></label><button className="bz-primary" type="submit">＋ Create roadmap</button></form><div className="bz-custom-roadmaps">{customRoadmaps.length === 0 ? <div className="bz-empty-state"><span>♧</span><h3>Your learning plan starts here</h3><p>Create a roadmap above, then check off topics as you complete them.</p></div> : customRoadmaps.map((roadmap) => { const pct = Math.round((roadmap.completed.length / Math.max(roadmap.topics.length, 1)) * 100); return <article className="bz-custom-roadmap-card" key={roadmap.id}><div className="bz-custom-roadmap-heading"><div><span className="bz-pill">{LANGUAGES.find((l) => l.id === roadmap.language)?.name}</span><h3>{roadmap.name}</h3></div><strong>{pct}%</strong></div><div className="bz-progress-track"><i style={{ width: `${pct}%` }} /></div>{roadmap.topics.map((topic) => <label className="bz-check-topic" key={topic}><input type="checkbox" checked={roadmap.completed.includes(topic)} onChange={() => toggleRoadmapTopic(roadmap.id, topic)} />{topic}</label>)}<button type="button" className="bz-text-button" onClick={() => setCustomRoadmaps((prev) => prev.filter((r) => r.id !== roadmap.id))}>Delete roadmap</button></article>; })}</div></section>}
      <p className="bz-footer-note">Progress on this first version is stored locally in your browser. Account-level sync can be connected to the existing backend next.</p>
    </div>
  );
}
