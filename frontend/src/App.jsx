import "./App.css";
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import AiAssistantPage from "./pages/ai-assistant/AiAssistantPage.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import BeginnerZone from "./BeginnerZone";
import DailyChallenge from "./DailyChallenge";


const API_URL = "http://localhost:5000";

const CODE_EXPLANATIONS = {
  java: {
    int: "int — Stores whole numbers. Example: int age = 20;",
    String: 'String — Stores text. Example: String name = "Ankit";',
    main: "main() — The entry point where Java program execution starts.",
    println: "println() — Prints output and moves to the next line.",
    print: "print() — Prints output without automatically moving to the next line.",
    public: "public — Allows access from other classes.",
    static: "static — Belongs to the class rather than an individual object.",
    void: "void — Indicates that a method does not return a value.",
    if: "if — Executes code when a condition is true.",
    else: "else — Executes code when the if condition is false.",
    for: "for — Repeats a block of code using a loop.",
    while: "while — Repeats code while a condition remains true.",
    return: "return — Exits a method and may return a value.",
    class: "class — Defines a blueprint for creating objects.",
    new: "new — Creates a new object.",
    boolean: "boolean — Stores true or false.",
    System: "System — Provides access to standard input, output and other system facilities.",
    out: "out — Represents the standard output stream.",
    args: "args — Receives command-line arguments passed to the Java program.",
    this: "this — Refers to the current object.",
    super: "super — Refers to the parent class.",
    final: "final — Prevents a variable from being reassigned.",
    try: "try — Contains code that may throw an exception.",
    catch: "catch — Handles an exception thrown by the try block.",
    throw: "throw — Explicitly throws an exception.",
    throws: "throws — Declares exceptions a method may throw.",
    extends: "extends — Allows a class to inherit from another class.",
    implements: "implements — Indicates that a class implements an interface.",
    interface: "interface — Defines a contract that classes can implement.",
    private: "private — Restricts access to the declaring class.",
    protected: "protected — Allows access within the package and subclasses.",
    import: "import — Makes classes or packages available to your code.",
    package: "package — Groups related Java classes.",
    double: "double — Stores decimal numbers with double precision.",
    char: "char — Stores a single character.",
    long: "long — Stores large whole numbers.",
    float: "float — Stores decimal numbers with single precision.",
    break: "break — Exits a loop or switch statement.",
    continue: "continue — Skips to the next loop iteration.",
  },

  c: {
    int: "int — Stores whole numbers. Example: int age = 20;",
    char: "char — Stores a single character. Example: char grade = 'A';",
    float: "float — Stores decimal numbers.",
    double: "double — Stores decimal numbers with more precision than float.",
    void: "void — Indicates that a function does not return a value.",
    main: "main() — The entry point where a C program starts running.",
    printf: "printf() — Prints formatted text or values to the console.",
    scanf: "scanf() — Reads formatted input from the user.",
    include: "#include — Includes declarations from a header file, such as stdio.h.",
    return: "return — Ends a function and may send a value back to the caller.",
    if: "if — Executes code when a condition is true.",
    else: "else — Executes code when the if condition is false.",
    for: "for — Repeats a block of code using a loop.",
    while: "while — Repeats code while a condition remains true.",
    break: "break — Exits a loop or switch statement.",
    continue: "continue — Skips to the next loop iteration.",
    sizeof: "sizeof — Returns the size of a type or object in bytes.",
    struct: "struct — Groups related variables under one type.",
    const: "const — Marks a value as not intended to be changed.",
  },

  cpp: {
    int: "int — Stores whole numbers.",
    main: "main() — The entry point of a C++ program.",
    cout: "cout — Displays output in the console.",
    cin: "cin — Reads input from the console.",
    endl: "endl — Inserts a newline into the output.",
    if: "if — Executes code when a condition is true.",
    else: "else — Executes code when the condition is false.",
    for: "for — Repeats code using a loop.",
    while: "while — Repeats code while a condition is true.",
    return: "return — Exits a function and may return a value.",
    void: "void — Indicates that a function does not return a value.",
    class: "class — Defines a blueprint for objects.",
    public: "public — Allows class members to be accessed from outside the class.",
    include: "#include — Includes declarations from a header file.",
    std: "std — The namespace containing standard C++ library features.",
    double: "double — Stores decimal numbers.",
    char: "char — Stores a single character.",
    bool: "bool — Stores true or false.",
    string: "string — Stores text.",
    const: "const — Prevents a variable from being modified through that name.",
    auto: "auto — Lets the compiler infer a variable's type.",
    break: "break — Exits a loop or switch statement.",
    continue: "continue — Skips to the next loop iteration.",
    switch: "switch — Selects a code branch based on a value.",
    case: "case — Defines a branch inside a switch statement.",
    default: "default — Defines the fallback branch in a switch statement.",
    try: "try — Starts a block for exception handling.",
    catch: "catch — Handles an exception.",
    private: "private — Restricts access to class members.",
    protected: "protected — Allows access to class members from the class and derived classes.",
    virtual: "virtual — Enables runtime polymorphism for member functions.",
    nullptr: "nullptr — Represents a null pointer.",
    delete: "delete — Releases memory allocated with new.",
    sizeof: "sizeof — Returns the size of a type or object in bytes.",
  },

  javascript: {
    const: "const — Declares a variable that cannot be reassigned.",
    let: "let — Declares a variable that can be reassigned.",
    function: "function — Defines reusable code.",
    return: "return — Ends a function and optionally returns a value.",
    console: "console — Provides methods for debugging.",
    log: "log() — Displays information in the console.",
    if: "if — Executes code when a condition is true.",
    else: "else — Executes code when the condition is false.",
    for: "for — Repeats code using a loop."
  },

  python: {
    print: "print() — Displays text or values.",
    def: "def — Defines a function.",
    return: "return — Ends a function and optionally returns a value.",
    if: "if — Executes code when a condition is true.",
    else: "else — Executes code when the condition is false.",
    for: "for — Iterates over items in a sequence.",
    while: "while — Repeats code while a condition is true.",
    import: "import — Makes a module available to your program.",
    class: "class — Defines a blueprint for creating objects."
  }
};

const problems = [
  {
    "id": 1,
    "title": "Two Sum",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n, then n integers, then the target. Print the two matching indices in array format, for example [0, 1].",
    "example": "4\n2 7 11 15\n9",
    "output": "Output: [0, 1]",
    "inputFormat": "Line 1: n. Line 2: n integers. Line 3: target. Print the two indices in array format, for example [0, 1].",
    "testCases": [
      {
        "input": "4\n2 7 11 15\n9",
        "expectedOutput": "[0, 1]"
      },
      {
        "input": "3\n3 2 4\n6",
        "expectedOutput": "[1, 2]"
      }
    ]
  },
  {
    "id": 2,
    "title": "Reverse a String",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read one line of text and print the characters in reverse order.",
    "example": "hello",
    "output": "Output: olleh",
    "inputFormat": "One line containing the string. Print only the reversed string.",
    "testCases": [
      {
        "input": "hello",
        "expectedOutput": "olleh"
      },
      {
        "input": "OpenAI",
        "expectedOutput": "IAnepO"
      }
    ]
  },
  {
    "id": 3,
    "title": "Binary Search",
    "topic": "Searching",
    "difficulty": "Medium",
    "description": "Read n, then n sorted integers, then the target. Print the zero-based index of the target, or -1 if it is absent.",
    "example": "4\n1 3 5 7\n5",
    "output": "Output: 2",
    "inputFormat": "Line 1: n. Line 2: n sorted integers. Line 3: target. Print only the zero-based index (or -1).",
    "testCases": [
      {
        "input": "4\n1 3 5 7\n5",
        "expectedOutput": "2"
      },
      {
        "input": "6\n2 4 6 8 10 12\n10",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": 4,
    "title": "Valid Parentheses",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Read a string containing brackets and print true if all brackets are balanced, otherwise print false.",
    "example": "()[]{}",
    "output": "Output: true",
    "inputFormat": "One line containing the bracket string. Print only true or false.",
    "testCases": [
      {
        "input": "()[]{}",
        "expectedOutput": "true"
      },
      {
        "input": "([)]",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 5,
    "title": "Maximum Subarray",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n followed by n integers. Print the largest sum of any non-empty contiguous subarray.",
    "example": "7\n-2 1 -3 4 -1 2 1",
    "output": "Output: 6",
    "inputFormat": "Line 1: n. Line 2: n integers. Print only the maximum subarray sum.",
    "testCases": [
      {
        "input": "7\n-2 1 -3 4 -1 2 1",
        "expectedOutput": "6"
      },
      {
        "input": "5\n-8 -3 -6 -2 -5",
        "expectedOutput": "-2"
      }
    ]
  },
  {
    "id": 6,
    "title": "Contains Duplicate",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n and n integers. Print true if any value appears at least twice, otherwise false.",
    "example": "5\n1 2 3 1",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n1 2 3 1",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 7,
    "title": "Best Time to Buy and Sell Stock",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n daily prices. Print the maximum profit from one buy followed by one sell; print 0 if no profit is possible.",
    "example": "6\n7 1 5 3 6 4",
    "output": "Output: 5",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6\n7 1 5 3 6 4",
        "expectedOutput": "5"
      },
      {
        "input": "5\n7 6 4 3 1",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": 8,
    "title": "Missing Number",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n and n distinct numbers from 0 through n. Print the missing number.",
    "example": "3\n3 0 1",
    "output": "Output: 2",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n3 0 1",
        "expectedOutput": "2"
      },
      {
        "input": "4\n0 1 2 4",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": 9,
    "title": "Majority Element",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n integers. Print the value that occurs more than n/2 times. The input guarantees such a value.",
    "example": "3\n3 2 3",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n3 2 3",
        "expectedOutput": "3"
      },
      {
        "input": "7\n2 2 1 1 1 2 2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": 10,
    "title": "Single Number",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n integers where every value except one occurs twice. Print the value that occurs once.",
    "example": "3\n2 2 1",
    "output": "Output: 1",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n2 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n4 1 2 1 2",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": 11,
    "title": "Product of Array Except Self",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n integers. Print the product of all other values for each index, separated by spaces. Do not use division.",
    "example": "4\n1 2 3 4",
    "output": "Output: 24 12 8 6",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "24 12 8 6"
      },
      {
        "input": "3\n-1 1 0",
        "expectedOutput": "0 0 -1"
      }
    ]
  },
  {
    "id": 12,
    "title": "Move Zeroes",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n integers. Move all zeroes to the end while preserving the order of non-zero values. Print space-separated values.",
    "example": "5\n0 1 0 3 12",
    "output": "Output: 1 3 12 0 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n0 1 0 3 12",
        "expectedOutput": "1 3 12 0 0"
      },
      {
        "input": "4\n0 0 1 2",
        "expectedOutput": "1 2 0 0"
      }
    ]
  },
  {
    "id": 13,
    "title": "Rotate Array",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n, n integers, and k. Rotate the array right by k positions and print space-separated values.",
    "example": "7\n1 2 3 4 5 6 7\n3",
    "output": "Output: 5 6 7 1 2 3 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7\n3",
        "expectedOutput": "5 6 7 1 2 3 4"
      },
      {
        "input": "4\n-1 -100 3 99\n2",
        "expectedOutput": "3 99 -1 -100"
      }
    ]
  },
  {
    "id": 14,
    "title": "Remove Duplicates from Sorted Array",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n sorted integers. Print the unique values once each, in sorted order, separated by spaces.",
    "example": "5\n1 1 2 2 3",
    "output": "Output: 1 2 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n1 1 2 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 15,
    "title": "Merge Sorted Array",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n, then n sorted integers, then m, then m sorted integers. Print the merged sorted array.",
    "example": "3\n1 2 4\n3\n1 3 4",
    "output": "Output: 1 1 2 3 4 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n1 2 4\n3\n1 3 4",
        "expectedOutput": "1 1 2 3 4 4"
      },
      {
        "input": "2\n1 5\n2\n2 3",
        "expectedOutput": "1 2 3 5"
      }
    ]
  },
  {
    "id": 16,
    "title": "Valid Anagram",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read two lines. Print true if the two strings contain the same characters with the same frequencies, otherwise false.",
    "example": "anagram\nnagaram",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "anagram\nnagaram",
        "expectedOutput": "true"
      },
      {
        "input": "rat\ncar",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 17,
    "title": "First Unique Character",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read a string and print the index of its first non-repeating character, or -1 if none exists.",
    "example": "leetcode",
    "output": "Output: 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "leetcode",
        "expectedOutput": "0"
      },
      {
        "input": "aabb",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": 18,
    "title": "Longest Common Prefix",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read n followed by n words. Print their longest common prefix, or an empty line if there is none.",
    "example": "3\nflower\nflow\nflight",
    "output": "Output: fl",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\nflower\nflow\nflight",
        "expectedOutput": "fl"
      },
      {
        "input": "3\ndog\nracecar\ncar",
        "expectedOutput": ""
      }
    ]
  },
  {
    "id": 19,
    "title": "Palindrome Number",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Read an integer. Print true if it reads the same forward and backward, otherwise false.",
    "example": "121",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "121",
        "expectedOutput": "true"
      },
      {
        "input": "-121",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 20,
    "title": "Palindrome String",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read one line. Ignore letter case and non-alphanumeric characters; print true if it is a palindrome, otherwise false.",
    "example": "A man, a plan, a canal: Panama",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "A man, a plan, a canal: Panama",
        "expectedOutput": "true"
      },
      {
        "input": "race a car",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 21,
    "title": "Reverse Integer",
    "topic": "Math",
    "difficulty": "Medium",
    "description": "Read a signed 32-bit integer and print its digits reversed. Print 0 if the reversed value overflows 32-bit signed range.",
    "example": "123",
    "output": "Output: 321",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "123",
        "expectedOutput": "321"
      },
      {
        "input": "-120",
        "expectedOutput": "-21"
      }
    ]
  },
  {
    "id": 22,
    "title": "Fizz Buzz",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Read n. Print values from 1 to n on separate lines; use Fizz for multiples of 3, Buzz for 5, and FizzBuzz for both.",
    "example": "5",
    "output": "Output: 1\n2\nFizz\n4\nBuzz",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "1\n2\nFizz\n4\nBuzz"
      },
      {
        "input": "3",
        "expectedOutput": "1\n2\nFizz"
      }
    ]
  },
  {
    "id": 23,
    "title": "Factorial",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Read a non-negative integer n and print n factorial.",
    "example": "5",
    "output": "Output: 120",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "120"
      },
      {
        "input": "0",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 24,
    "title": "Fibonacci Number",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Read n and print the nth Fibonacci number using F(0)=0 and F(1)=1.",
    "example": "6",
    "output": "Output: 8",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6",
        "expectedOutput": "8"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": 25,
    "title": "Prime Number Check",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Read an integer n. Print true if n is prime, otherwise false.",
    "example": "17",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "17",
        "expectedOutput": "true"
      },
      {
        "input": "1",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 26,
    "title": "Greatest Common Divisor",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Read two non-negative integers and print their greatest common divisor.",
    "example": "18 24",
    "output": "Output: 6",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "18 24",
        "expectedOutput": "6"
      },
      {
        "input": "7 13",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 27,
    "title": "Linear Search",
    "topic": "Searching",
    "difficulty": "Easy",
    "description": "Read n, n integers, and target. Print the first zero-based index of target, or -1 if absent.",
    "example": "5\n4 2 7 2 9\n2",
    "output": "Output: 1",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n4 2 7 2 9\n2",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 3 5\n2",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": 28,
    "title": "Sort Array",
    "topic": "Sorting",
    "difficulty": "Easy",
    "description": "Read n integers and print them in ascending order, separated by spaces.",
    "example": "5\n5 2 3 1 4",
    "output": "Output: 1 2 3 4 5",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n5 2 3 1 4",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "4\n-1 3 0 -2",
        "expectedOutput": "-2 -1 0 3"
      }
    ]
  },
  {
    "id": 29,
    "title": "Find First and Last Position",
    "topic": "Searching",
    "difficulty": "Medium",
    "description": "Read n, a sorted array, and target. Print [first, last] indices, or [-1, -1] if absent.",
    "example": "6\n5 7 7 8 8 10\n8",
    "output": "Output: [3, 4]",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6\n5 7 7 8 8 10\n8",
        "expectedOutput": "[3, 4]"
      },
      {
        "input": "6\n5 7 7 8 8 10\n6",
        "expectedOutput": "[-1, -1]"
      }
    ]
  },
  {
    "id": 30,
    "title": "Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Read n. Each move can climb one or two steps. Print the number of distinct ways to reach step n.",
    "example": "5",
    "output": "Output: 8",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "8"
      },
      {
        "input": "2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": 31,
    "title": "House Robber",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Read n house values. Print the maximum sum you can take without choosing adjacent values.",
    "example": "4\n1 2 3 1",
    "output": "Output: 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n1 2 3 1",
        "expectedOutput": "4"
      },
      {
        "input": "5\n2 7 9 3 1",
        "expectedOutput": "12"
      }
    ]
  },
  {
    "id": 32,
    "title": "Maximum Product Subarray",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n integers. Print the maximum product of a non-empty contiguous subarray.",
    "example": "4\n2 3 -2 4",
    "output": "Output: 6",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n2 3 -2 4",
        "expectedOutput": "6"
      },
      {
        "input": "3\n-2 0 -1",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": 33,
    "title": "Container With Most Water",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n non-negative heights. Print the maximum water area between two lines.",
    "example": "9\n1 8 6 2 5 4 8 3 7",
    "output": "Output: 49",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "9\n1 8 6 2 5 4 8 3 7",
        "expectedOutput": "49"
      },
      {
        "input": "2\n1 1",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 34,
    "title": "3Sum",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n integers. Print unique triplets summing to zero, one triplet per line, each sorted and formatted [a, b, c]. Sort the output lines lexicographically.",
    "example": "6\n-1 0 1 2 -1 -4",
    "output": "Output: [-1, -1, 2]\n[-1, 0, 1]",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6\n-1 0 1 2 -1 -4",
        "expectedOutput": "[-1, -1, 2]\n[-1, 0, 1]"
      },
      {
        "input": "3\n0 1 1",
        "expectedOutput": ""
      }
    ]
  },
  {
    "id": 35,
    "title": "Search in Rotated Sorted Array",
    "topic": "Searching",
    "difficulty": "Medium",
    "description": "Read n, a rotated sorted array with unique values, and target. Print the target index or -1.",
    "example": "7\n4 5 6 7 0 1 2\n0",
    "output": "Output: 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "7\n4 5 6 7 0 1 2\n0",
        "expectedOutput": "4"
      },
      {
        "input": "7\n4 5 6 7 0 1 2\n3",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": 36,
    "title": "Min Cost Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Read n costs. You may start at step 0 or 1 and climb one or two steps. Print the minimum cost to reach the top.",
    "example": "3\n10 15 20",
    "output": "Output: 15",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n10 15 20",
        "expectedOutput": "15"
      },
      {
        "input": "10\n1 100 1 1 1 100 1 1 100 1",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": 37,
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Read one line and print the length of the longest substring with no repeated characters.",
    "example": "abcabcbb",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "abcabcbb",
        "expectedOutput": "3"
      },
      {
        "input": "bbbbb",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 38,
    "title": "Implement Queue Operations",
    "topic": "Queue",
    "difficulty": "Easy",
    "description": "Read n followed by n integers and print them in FIFO order. This starter problem practices queue basics.",
    "example": "4\n10 20 30 40",
    "output": "Output: 10 20 30 40",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n10 20 30 40",
        "expectedOutput": "10 20 30 40"
      },
      {
        "input": "3\n5 1 9",
        "expectedOutput": "5 1 9"
      }
    ]
  },
  {
    "id": 39,
    "title": "Binary Tree Level Order Traversal",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Read n node values as a simple level-order sequence and print them level by level, each level on a separate line. This version uses a complete binary tree.",
    "example": "7\n1 2 3 4 5 6 7",
    "output": "Output: 1\n2 3\n4 5 6 7",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "1\n2 3\n4 5 6 7"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1\n2 3"
      }
    ]
  },
  {
    "id": 40,
    "title": "Number of Islands",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Read rows and columns followed by a grid of 0/1 values. Count connected groups of 1s using horizontal and vertical neighbors.",
    "example": "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "2 2\n1 1\n0 1",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 41,
    "title": "Coin Change",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Read n coin denominations, then the amount. Print the minimum number of coins needed, or -1 if impossible.",
    "example": "3\n1 2 5\n11",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n1 2 5\n11",
        "expectedOutput": "3"
      },
      {
        "input": "1\n2\n3",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": 42,
    "title": "Merge Intervals",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n intervals, then n start/end pairs. Merge overlapping intervals and print each merged interval as [start, end] on its own line.",
    "example": "4\n1 3\n2 6\n8 10\n15 18",
    "output": "Output: [1, 6]\n[8, 10]\n[15, 18]",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n1 3\n2 6\n8 10\n15 18",
        "expectedOutput": "[1, 6]\n[8, 10]\n[15, 18]"
      },
      {
        "input": "2\n1 4\n4 5",
        "expectedOutput": "[1, 5]"
      }
    ]
  },
  {
    "id": 43,
    "title": "Valid Sudoku",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read a 9x9 grid using digits 1-9 and dots for empty cells. Print true if rows, columns, and 3x3 boxes have no duplicate digits; otherwise false.",
    "example": "9\n53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "9\n53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
        "expectedOutput": "true"
      },
      {
        "input": "9\n553..7...\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 44,
    "title": "Remove Duplicates from Sorted Array",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n sorted integers and print the number of unique values.",
    "example": "5\n1 1 2 2 3",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n1 1 2 2 3",
        "expectedOutput": "3"
      },
      {
        "input": "4\n0 0 1 1",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": 45,
    "title": "Rotate Array",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n, n integers, and k. Rotate the array right by k positions and print the result.",
    "example": "5\n1 2 3 4 5\n2",
    "output": "Output: 4 5 1 2 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5\n2",
        "expectedOutput": "4 5 1 2 3"
      },
      {
        "input": "3\n1 2 3\n1",
        "expectedOutput": "3 1 2"
      }
    ]
  },
  {
    "id": 46,
    "title": "Intersection of Two Arrays",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n and its values, then m and its values. Print unique common values in ascending order.",
    "example": "4\n1 2 2 1\n2\n2 2",
    "output": "Output: 2",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n1 2 2 1\n2\n2 2",
        "expectedOutput": "2"
      },
      {
        "input": "3\n4 9 5\n3\n9 4 9",
        "expectedOutput": "4 9"
      }
    ]
  },
  {
    "id": 47,
    "title": "Move Zeroes",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n integers. Move all zeroes to the end and preserve the order of non-zero values.",
    "example": "5\n0 1 0 3 12",
    "output": "Output: 1 3 12 0 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n0 1 0 3 12",
        "expectedOutput": "1 3 12 0 0"
      },
      {
        "input": "3\n0 0 1",
        "expectedOutput": "1 0 0"
      }
    ]
  },
  {
    "id": 48,
    "title": "Find Pivot Index",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n integers and print the first index where left sum equals right sum, or -1.",
    "example": "6\n1 7 3 6 5 6",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6\n1 7 3 6 5 6",
        "expectedOutput": "3"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": 49,
    "title": "Maximum Product Subarray",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Read n integers and print the largest product of a non-empty contiguous subarray.",
    "example": "4\n2 3 -2 4",
    "output": "Output: 6",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n2 3 -2 4",
        "expectedOutput": "6"
      },
      {
        "input": "3\n-2 0 -1",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": 50,
    "title": "Search Insert Position",
    "topic": "Searching",
    "difficulty": "Easy",
    "description": "Read n sorted integers and a target. Print its index if found, otherwise its insertion index.",
    "example": "4\n1 3 5 6\n5",
    "output": "Output: 2",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n1 3 5 6\n5",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 3 5 6\n2",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 51,
    "title": "First Bad Version",
    "topic": "Searching",
    "difficulty": "Easy",
    "description": "Read n and the first bad version b. Print b, the first bad version in versions 1 through n.",
    "example": "5 4",
    "output": "Output: 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5 4",
        "expectedOutput": "4"
      },
      {
        "input": "1 1",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 52,
    "title": "Sort Colors",
    "topic": "Sorting",
    "difficulty": "Medium",
    "description": "Read n values containing only 0, 1, and 2. Print them sorted in ascending order.",
    "example": "6\n2 0 2 1 1 0",
    "output": "Output: 0 0 1 1 2 2",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6\n2 0 2 1 1 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "3\n2 0 1",
        "expectedOutput": "0 1 2"
      }
    ]
  },
  {
    "id": 53,
    "title": "Merge Sorted Arrays",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Read n, first sorted array, m, and second sorted array. Print the merged sorted array.",
    "example": "3\n1 2 3\n3\n2 5 6",
    "output": "Output: 1 2 2 3 5 6",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n1 2 3\n3\n2 5 6",
        "expectedOutput": "1 2 2 3 5 6"
      },
      {
        "input": "2\n1 2\n2\n3 4",
        "expectedOutput": "1 2 3 4"
      }
    ]
  },
  {
    "id": 54,
    "title": "Longest Common Prefix",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read n words and print their longest common prefix, or an empty line if none.",
    "example": "3\nflower\nflow\nflight",
    "output": "Output: fl",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\nflower\nflow\nflight",
        "expectedOutput": "fl"
      },
      {
        "input": "2\ndog\nracecar",
        "expectedOutput": ""
      }
    ]
  },
  {
    "id": 55,
    "title": "Valid Anagram",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read two strings on separate lines. Print true if they are anagrams, otherwise false.",
    "example": "anagram\nnagaram",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "anagram\nnagaram",
        "expectedOutput": "true"
      },
      {
        "input": "rat\ncar",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 56,
    "title": "First Unique Character",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read a string and print the index of its first non-repeating character, or -1.",
    "example": "leetcode",
    "output": "Output: 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "leetcode",
        "expectedOutput": "0"
      },
      {
        "input": "aabb",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": 57,
    "title": "Implement strStr",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Read a text line and a pattern line. Print the first index of pattern in text, or -1.",
    "example": "sadbutsad\nsad",
    "output": "Output: 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "sadbutsad\nsad",
        "expectedOutput": "0"
      },
      {
        "input": "hello\nll",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": 58,
    "title": "Longest Palindromic Substring",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Read a string and print the longest palindromic substring. If tied, print the first one found.",
    "example": "babad",
    "output": "Output: bab",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "babad",
        "expectedOutput": "bab"
      },
      {
        "input": "cbbd",
        "expectedOutput": "bb"
      }
    ]
  },
  {
    "id": 59,
    "title": "Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Read n steps. Print the number of distinct ways to reach step n using 1 or 2 steps.",
    "example": "5",
    "output": "Output: 8",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "8"
      },
      {
        "input": "3",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": 60,
    "title": "House Robber",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Read n house values. Print the maximum amount that can be robbed without taking adjacent houses.",
    "example": "4\n1 2 3 1",
    "output": "Output: 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n1 2 3 1",
        "expectedOutput": "4"
      },
      {
        "input": "5\n2 7 9 3 1",
        "expectedOutput": "12"
      }
    ]
  },
  {
    "id": 61,
    "title": "Longest Increasing Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Read n integers and print the length of the longest strictly increasing subsequence.",
    "example": "8\n10 9 2 5 3 7 101 18",
    "output": "Output: 4",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "expectedOutput": "4"
      },
      {
        "input": "4\n0 1 0 3",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": 62,
    "title": "Unique Paths",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Read m and n. Print the number of paths from the top-left to bottom-right of an m by n grid moving only right or down.",
    "example": "3 7",
    "output": "Output: 28",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3 7",
        "expectedOutput": "28"
      },
      {
        "input": "3 2",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": 63,
    "title": "Fibonacci Number",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Read n and print the nth Fibonacci number where F(0)=0 and F(1)=1.",
    "example": "6",
    "output": "Output: 8",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "6",
        "expectedOutput": "8"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": 64,
    "title": "Reverse Linked List",
    "topic": "Linked List",
    "difficulty": "Easy",
    "description": "Read n values representing a linked list and print the values in reverse order.",
    "example": "5\n1 2 3 4 5",
    "output": "Output: 5 4 3 2 1",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5 4 3 2 1"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "3 2 1"
      }
    ]
  },
  {
    "id": 65,
    "title": "Middle of Linked List",
    "topic": "Linked List",
    "difficulty": "Easy",
    "description": "Read n linked-list values and print the middle value; for even n, print the second middle value.",
    "example": "5\n1 2 3 4 5",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "3"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": 66,
    "title": "Linked List Cycle",
    "topic": "Linked List",
    "difficulty": "Easy",
    "description": "Read n values and a cycle flag (0 or 1). Print true if a cycle exists, otherwise false.",
    "example": "3\n1 2 3\n1",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "3\n1 2 3\n1",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3\n0",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 67,
    "title": "Implement Stack",
    "topic": "Stack",
    "difficulty": "Easy",
    "description": "Read n integers and print them in reverse order to demonstrate last-in, first-out behavior.",
    "example": "4\n10 20 30 40",
    "output": "Output: 40 30 20 10",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "4\n10 20 30 40",
        "expectedOutput": "40 30 20 10"
      },
      {
        "input": "3\n5 1 9",
        "expectedOutput": "9 1 5"
      }
    ]
  },
  {
    "id": 68,
    "title": "Daily Temperatures",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Read n daily temperatures. For each day print days until a warmer temperature, or 0 if none.",
    "example": "8\n73 74 75 71 69 72 76 73",
    "output": "Output: 1 1 4 2 1 1 0 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "8\n73 74 75 71 69 72 76 73",
        "expectedOutput": "1 1 4 2 1 1 0 0"
      },
      {
        "input": "4\n30 40 50 60",
        "expectedOutput": "1 1 1 0"
      }
    ]
  },
  {
    "id": 69,
    "title": "Evaluate Reverse Polish Notation",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Read n tokens in postfix notation separated by spaces. Print the integer result.",
    "example": "5\n2 1 + 3 *",
    "output": "Output: 9",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "5\n2 1 + 3 *",
        "expectedOutput": "9"
      },
      {
        "input": "5\n4 13 5 / +",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": 70,
    "title": "Number of 1 Bits",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "description": "Read a non-negative integer and print the number of set bits in its binary representation.",
    "example": "11",
    "output": "Output: 3",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "11",
        "expectedOutput": "3"
      },
      {
        "input": "128",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": 71,
    "title": "Power of Two",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "description": "Read an integer and print true if it is a positive power of two, otherwise false.",
    "example": "16",
    "output": "Output: true",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "16",
        "expectedOutput": "true"
      },
      {
        "input": "18",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": 72,
    "title": "Reverse Bits",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "description": "Read a 32-bit unsigned integer and print the decimal value after reversing its 32 bits.",
    "example": "43261596",
    "output": "Output: 964176192",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "43261596",
        "expectedOutput": "964176192"
      },
      {
        "input": "1",
        "expectedOutput": "2147483648"
      }
    ]
  },
  {
    "id": 73,
    "title": "Flood Fill",
    "topic": "Graphs",
    "difficulty": "Easy",
    "description": "Read rows and columns, a grid, starting row/column and new color. Print the updated grid row by row.",
    "example": "2 3\n1 1 1\n1 1 0\n0 0 2 3",
    "output": "Output: 3 3 3\n3 3 0",
    "inputFormat": "Use the input shown in the example. Print only the required result; do not add labels or explanations.",
    "testCases": [
      {
        "input": "2 3\n1 1 1\n1 1 0\n0 0 2 3",
        "expectedOutput": "3 3 3\n3 3 0"
      },
      {
        "input": "2 2\n0 0\n0 0\n0 0 1",
        "expectedOutput": "1 1\n1 1"
      }
    ]
  }
,
  {
    "id": 74,
    "title": "4Sum",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Given an integer array and a target, find all unique quadruplets [a, b, c, d] such that a + b + c + d equals the target. Each quadruplet must use four different array positions. Do not return duplicate quadruplets.",
    "example": "6\n1 0 -1 0 -2 2\n0",
    "output": "[-2, -1, 1, 2]\n[-2, 0, 0, 2]\n[-1, 0, 0, 1]",
    "inputFormat": "Line 1: n, the number of integers. Line 2: n space-separated integers. Line 3: target. Print each unique quadruplet on its own line in ascending order, formatted as [a, b, c, d]. Sort the output lines lexicographically. If no quadruplet exists, print nothing.",
    "testCases": [
      {
        "input": "6\n1 0 -1 0 -2 2\n0",
        "expectedOutput": "[-2, -1, 1, 2]\n[-2, 0, 0, 2]\n[-1, 0, 0, 1]"
      },
      {
        "input": "5\n2 2 2 2 2\n8",
        "expectedOutput": "[2, 2, 2, 2]"
      },
      {
        "input": "4\n1 2 3 4\n100",
        "expectedOutput": ""
      }
    ]
  },
  {
    "id": 75,
    "title": "3Sum Closest",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice 3Sum Closest. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 76,
    "title": "4Sum II",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice 4Sum II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 77,
    "title": "Trapping Rain Water",
    "topic": "Two Pointers",
    "difficulty": "Easy",
    "description": "Practice Trapping Rain Water. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 78,
    "title": "Jump Game",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Jump Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 79,
    "title": "Jump Game II",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Jump Game II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 80,
    "title": "Gas Station",
    "topic": "Greedy",
    "difficulty": "Easy",
    "description": "Practice Gas Station. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 81,
    "title": "Candy",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Candy. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 82,
    "title": "First Missing Positive",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice First Missing Positive. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 83,
    "title": "Find the Duplicate Number",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Find the Duplicate Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 84,
    "title": "Next Permutation",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice Next Permutation. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 85,
    "title": "Insert Interval",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Insert Interval. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 86,
    "title": "Non-overlapping Intervals",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Non-overlapping Intervals. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 87,
    "title": "Meeting Rooms",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Meeting Rooms. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 88,
    "title": "Meeting Rooms II",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Meeting Rooms II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 89,
    "title": "Minimum Number of Arrows to Burst Balloons",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Minimum Number of Arrows to Burst Balloons. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 90,
    "title": "Largest Number",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Largest Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 91,
    "title": "H-Index",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice H-Index. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 92,
    "title": "H-Index II",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice H-Index II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 93,
    "title": "Top K Frequent Elements",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Top K Frequent Elements. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 94,
    "title": "Kth Largest Element in an Array",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Kth Largest Element in an Array. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 95,
    "title": "Find Peak Element",
    "topic": "Searching",
    "difficulty": "Easy",
    "description": "Practice Find Peak Element. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 96,
    "title": "Find Minimum in Rotated Sorted Array",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Find Minimum in Rotated Sorted Array. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 97,
    "title": "Search a 2D Matrix",
    "topic": "Searching",
    "difficulty": "Hard",
    "description": "Practice Search a 2D Matrix. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 98,
    "title": "Spiral Matrix",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Spiral Matrix. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 99,
    "title": "Rotate Image",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Rotate Image. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 100,
    "title": "Set Matrix Zeroes",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Set Matrix Zeroes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 101,
    "title": "Game of Life",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Game of Life. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 102,
    "title": "Plus One",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Plus One. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 103,
    "title": "Add Binary",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Add Binary. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 104,
    "title": "Add Strings",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Add Strings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 105,
    "title": "Multiply Strings",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Multiply Strings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 106,
    "title": "String to Integer (atoi)",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice String to Integer (atoi). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 107,
    "title": "Implement strStr()",
    "topic": "Design",
    "difficulty": "Easy",
    "description": "Practice Implement strStr(). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 108,
    "title": "Palindromic Substrings",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Palindromic Substrings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 109,
    "title": "Longest Repeating Character Replacement",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Longest Repeating Character Replacement. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 110,
    "title": "Find All Anagrams in a String",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Find All Anagrams in a String. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 111,
    "title": "Permutation in String",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Permutation in String. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 112,
    "title": "Minimum Window Substring",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Minimum Window Substring. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 113,
    "title": "Group Anagrams",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Group Anagrams. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 114,
    "title": "Isomorphic Strings",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Isomorphic Strings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 115,
    "title": "Word Pattern",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Word Pattern. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 116,
    "title": "Ransom Note",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Ransom Note. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 117,
    "title": "First Unique Character in a String",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice First Unique Character in a String. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 118,
    "title": "Find the Index of the First Occurrence",
    "topic": "Searching",
    "difficulty": "Hard",
    "description": "Practice Find the Index of the First Occurrence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 119,
    "title": "Zigzag Conversion",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Zigzag Conversion. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 120,
    "title": "Count and Say",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Count and Say. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 121,
    "title": "Compare Version Numbers",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Compare Version Numbers. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 122,
    "title": "Simplify Path",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Simplify Path. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 123,
    "title": "Text Justification",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Text Justification. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 124,
    "title": "Longest Valid Parentheses",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Longest Valid Parentheses. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 125,
    "title": "Decode String",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Decode String. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 126,
    "title": "Remove Duplicate Letters",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Remove Duplicate Letters. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 127,
    "title": "Basic Calculator",
    "topic": "Stack",
    "difficulty": "Easy",
    "description": "Practice Basic Calculator. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 128,
    "title": "Basic Calculator II",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Practice Basic Calculator II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 129,
    "title": "Next Greater Element I",
    "topic": "Stack",
    "difficulty": "Hard",
    "description": "Practice Next Greater Element I. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 130,
    "title": "Next Greater Element II",
    "topic": "Stack",
    "difficulty": "Hard",
    "description": "Practice Next Greater Element II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 131,
    "title": "Online Stock Span",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Online Stock Span. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 132,
    "title": "Min Stack",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Practice Min Stack. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 133,
    "title": "Implement Queue using Stacks",
    "topic": "Stack",
    "difficulty": "Easy",
    "description": "Practice Implement Queue using Stacks. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 134,
    "title": "Implement Stack using Queues",
    "topic": "Stack",
    "difficulty": "Easy",
    "description": "Practice Implement Stack using Queues. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 135,
    "title": "Design Circular Queue",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Design Circular Queue. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 136,
    "title": "Design HashMap",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design HashMap. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 137,
    "title": "Design HashSet",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design HashSet. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 138,
    "title": "LRU Cache",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice LRU Cache. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 139,
    "title": "LFU Cache",
    "topic": "Design",
    "difficulty": "Easy",
    "description": "Practice LFU Cache. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 140,
    "title": "Time Based Key-Value Store",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Time Based Key-Value Store. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 141,
    "title": "Randomized Set",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Randomized Set. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 142,
    "title": "Insert Delete GetRandom O(1)",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Insert Delete GetRandom O(1). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 143,
    "title": "Find Median from Data Stream",
    "topic": "Queue",
    "difficulty": "Easy",
    "description": "Practice Find Median from Data Stream. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 144,
    "title": "Kth Largest Element in a Stream",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Kth Largest Element in a Stream. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 145,
    "title": "Sliding Window Maximum",
    "topic": "Sliding Window",
    "difficulty": "Hard",
    "description": "Practice Sliding Window Maximum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 146,
    "title": "Maximum of Minimum for Every Window",
    "topic": "Sliding Window",
    "difficulty": "Hard",
    "description": "Practice Maximum of Minimum for Every Window. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 147,
    "title": "Largest Rectangle in Histogram",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Practice Largest Rectangle in Histogram. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 148,
    "title": "Maximal Rectangle",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Maximal Rectangle. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 149,
    "title": "Asteroid Collision",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Asteroid Collision. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 150,
    "title": "Car Fleet",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Car Fleet. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 151,
    "title": "Simplify Unix Path",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Simplify Unix Path. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 152,
    "title": "Remove K Digits",
    "topic": "Stack",
    "difficulty": "Hard",
    "description": "Practice Remove K Digits. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 153,
    "title": "132 Pattern",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice 132 Pattern. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 154,
    "title": "Sum of Subarray Minimums",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Sum of Subarray Minimums. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 155,
    "title": "Subarray Ranges",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Subarray Ranges. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 156,
    "title": "Find the Most Competitive Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice Find the Most Competitive Subsequence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 157,
    "title": "Merge Two Sorted Lists",
    "topic": "Greedy",
    "difficulty": "Easy",
    "description": "Practice Merge Two Sorted Lists. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 158,
    "title": "Linked List Cycle II",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice Linked List Cycle II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 159,
    "title": "Remove Nth Node From End of List",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Remove Nth Node From End of List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 160,
    "title": "Middle of the Linked List",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice Middle of the Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 161,
    "title": "Palindrome Linked List",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Palindrome Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 162,
    "title": "Intersection of Two Linked Lists",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice Intersection of Two Linked Lists. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 163,
    "title": "Add Two Numbers",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Add Two Numbers. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 164,
    "title": "Add Two Numbers II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Add Two Numbers II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 165,
    "title": "Merge k Sorted Lists",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Merge k Sorted Lists. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 166,
    "title": "Swap Nodes in Pairs",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Swap Nodes in Pairs. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 167,
    "title": "Reverse Nodes in k-Group",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Reverse Nodes in k-Group. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 168,
    "title": "Reorder List",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Reorder List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 169,
    "title": "Rotate List",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Rotate List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 170,
    "title": "Sort List",
    "topic": "Greedy",
    "difficulty": "Easy",
    "description": "Practice Sort List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 171,
    "title": "Remove Duplicates from Sorted List",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Remove Duplicates from Sorted List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 172,
    "title": "Remove Duplicates from Sorted List II",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Remove Duplicates from Sorted List II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 173,
    "title": "Partition List",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Partition List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 174,
    "title": "Copy List with Random Pointer",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Copy List with Random Pointer. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 175,
    "title": "Flatten a Multilevel Doubly Linked List",
    "topic": "Linked List",
    "difficulty": "Hard",
    "description": "Practice Flatten a Multilevel Doubly Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 176,
    "title": "Design Linked List",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice Design Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 177,
    "title": "LRU Cache from Linked List",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice LRU Cache from Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 178,
    "title": "Convert Binary Number in a Linked List to Integer",
    "topic": "Linked List",
    "difficulty": "Hard",
    "description": "Practice Convert Binary Number in a Linked List to Integer. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 179,
    "title": "Delete Node in a Linked List",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice Delete Node in a Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 180,
    "title": "Odd Even Linked List",
    "topic": "Linked List",
    "difficulty": "Hard",
    "description": "Practice Odd Even Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 181,
    "title": "Reverse Linked List II",
    "topic": "Linked List",
    "difficulty": "Hard",
    "description": "Practice Reverse Linked List II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 182,
    "title": "Remove Linked List Elements",
    "topic": "Linked List",
    "difficulty": "Hard",
    "description": "Practice Remove Linked List Elements. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 183,
    "title": "Linked List Components",
    "topic": "Linked List",
    "difficulty": "Medium",
    "description": "Practice Linked List Components. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 184,
    "title": "Next Greater Node In Linked List",
    "topic": "Linked List",
    "difficulty": "Hard",
    "description": "Practice Next Greater Node In Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 185,
    "title": "Binary Tree Inorder Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Binary Tree Inorder Traversal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 186,
    "title": "Binary Tree Preorder Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Binary Tree Preorder Traversal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 187,
    "title": "Binary Tree Postorder Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Binary Tree Postorder Traversal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 188,
    "title": "Binary Tree Zigzag Level Order Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Binary Tree Zigzag Level Order Traversal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 189,
    "title": "Maximum Depth of Binary Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Maximum Depth of Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 190,
    "title": "Minimum Depth of Binary Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Minimum Depth of Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 191,
    "title": "Invert Binary Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Invert Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 192,
    "title": "Same Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Same Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 193,
    "title": "Symmetric Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Symmetric Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 194,
    "title": "Path Sum",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Path Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 195,
    "title": "Path Sum II",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Path Sum II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 196,
    "title": "Path Sum III",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Path Sum III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 197,
    "title": "Diameter of Binary Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Diameter of Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 198,
    "title": "Balanced Binary Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Balanced Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 199,
    "title": "Subtree of Another Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Subtree of Another Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 200,
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Lowest Common Ancestor of a Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 201,
    "title": "Lowest Common Ancestor of a Binary Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Lowest Common Ancestor of a Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 202,
    "title": "Validate Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Validate Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 203,
    "title": "Kth Smallest Element in a BST",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Kth Smallest Element in a BST. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 204,
    "title": "Convert Sorted Array to Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Convert Sorted Array to Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 205,
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Construct Binary Tree from Preorder and Inorder Traversal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 206,
    "title": "Construct Binary Tree from Inorder and Postorder Traversal",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Construct Binary Tree from Inorder and Postorder Traversal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 207,
    "title": "Serialize and Deserialize Binary Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Serialize and Deserialize Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 208,
    "title": "Flatten Binary Tree to Linked List",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Flatten Binary Tree to Linked List. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 209,
    "title": "Binary Tree Right Side View",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Binary Tree Right Side View. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 210,
    "title": "Count Complete Tree Nodes",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Count Complete Tree Nodes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 211,
    "title": "Populating Next Right Pointers in Each Node",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Populating Next Right Pointers in Each Node. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 212,
    "title": "Populating Next Right Pointers in Each Node II",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Populating Next Right Pointers in Each Node II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 213,
    "title": "All Nodes Distance K in Binary Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice All Nodes Distance K in Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 214,
    "title": "Maximum Width of Binary Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Maximum Width of Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 215,
    "title": "Recover Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Recover Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 216,
    "title": "Find Mode in Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Find Mode in Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 217,
    "title": "Delete Node in a BST",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Practice Delete Node in a BST. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 218,
    "title": "Insert into a Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Insert into a Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 219,
    "title": "Search in a Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Search in a Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 220,
    "title": "Trim a Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Trim a Binary Search Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 221,
    "title": "Range Sum of BST",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Practice Range Sum of BST. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 222,
    "title": "Minimum Absolute Difference in BST",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Minimum Absolute Difference in BST. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 223,
    "title": "Convert BST to Greater Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Convert BST to Greater Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 224,
    "title": "Binary Tree Maximum Path Sum",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Binary Tree Maximum Path Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 225,
    "title": "House Robber III",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice House Robber III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 226,
    "title": "Sum Root to Leaf Numbers",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Practice Sum Root to Leaf Numbers. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 227,
    "title": "Find Duplicate Subtrees",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Find Duplicate Subtrees. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 228,
    "title": "Vertical Order Traversal of a Binary Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Vertical Order Traversal of a Binary Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 229,
    "title": "Unique Binary Search Trees",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Unique Binary Search Trees. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 230,
    "title": "Unique Binary Search Trees II",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Practice Unique Binary Search Trees II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 231,
    "title": "Generate Parentheses",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Generate Parentheses. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 232,
    "title": "Letter Combinations of a Phone Number",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Letter Combinations of a Phone Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 233,
    "title": "Combination Sum",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Combination Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 234,
    "title": "Combination Sum II",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Combination Sum II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 235,
    "title": "Combination Sum III",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice Combination Sum III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 236,
    "title": "Permutations",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Permutations. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 237,
    "title": "Permutations II",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Permutations II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 238,
    "title": "Subsets",
    "topic": "Backtracking",
    "difficulty": "Easy",
    "description": "Practice Subsets. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 239,
    "title": "Subsets II",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Subsets II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 240,
    "title": "Word Search",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Word Search. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 241,
    "title": "Word Search II",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Word Search II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 242,
    "title": "N-Queens",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice N-Queens. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 243,
    "title": "N-Queens II",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice N-Queens II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 244,
    "title": "Palindrome Partitioning",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Palindrome Partitioning. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 245,
    "title": "Restore IP Addresses",
    "topic": "Backtracking",
    "difficulty": "Easy",
    "description": "Practice Restore IP Addresses. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 246,
    "title": "Sudoku Solver",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice Sudoku Solver. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 247,
    "title": "Letter Case Permutation",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Letter Case Permutation. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 248,
    "title": "Beautiful Arrangement",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Beautiful Arrangement. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 249,
    "title": "Matchsticks to Square",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Matchsticks to Square. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 250,
    "title": "Partition to K Equal Sum Subsets",
    "topic": "Backtracking",
    "difficulty": "Easy",
    "description": "Practice Partition to K Equal Sum Subsets. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 251,
    "title": "Different Ways to Add Parentheses",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Different Ways to Add Parentheses. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 252,
    "title": "Expression Add Operators",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Expression Add Operators. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 253,
    "title": "Combination Sum IV",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice Combination Sum IV. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 254,
    "title": "Find K-th Smallest Pair Distance",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Find K-th Smallest Pair Distance. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 255,
    "title": "The Skyline Problem",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice The Skyline Problem. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 256,
    "title": "Count of Smaller Numbers After Self",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Count of Smaller Numbers After Self. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 257,
    "title": "Reverse Pairs",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Reverse Pairs. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 258,
    "title": "Create Maximum Number",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Create Maximum Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 259,
    "title": "Burst Balloons",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Burst Balloons. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 260,
    "title": "Remove Boxes",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Remove Boxes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 261,
    "title": "Freedom Trail",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Freedom Trail. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 262,
    "title": "Strange Printer",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Strange Printer. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 263,
    "title": "Regular Expression Matching",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Regular Expression Matching. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 264,
    "title": "Wildcard Matching",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Wildcard Matching. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 265,
    "title": "Edit Distance",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Practice Edit Distance. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 266,
    "title": "Distinct Subsequences",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Distinct Subsequences. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 267,
    "title": "Interleaving String",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Interleaving String. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 268,
    "title": "Decode Ways",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Decode Ways. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 269,
    "title": "Decode Ways II",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Decode Ways II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 270,
    "title": "Word Break",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Word Break. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 271,
    "title": "Word Break II",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Word Break II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 272,
    "title": "Number of Longest Increasing Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Number of Longest Increasing Subsequence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 273,
    "title": "Russian Doll Envelopes",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Russian Doll Envelopes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 274,
    "title": "Maximum Length of Pair Chain",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Maximum Length of Pair Chain. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 275,
    "title": "Partition Equal Subset Sum",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Practice Partition Equal Subset Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 276,
    "title": "Target Sum",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Target Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 277,
    "title": "Last Stone Weight II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Last Stone Weight II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 278,
    "title": "Ones and Zeroes",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Ones and Zeroes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 279,
    "title": "Coin Change II",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Coin Change II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 280,
    "title": "Perfect Squares",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Perfect Squares. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 281,
    "title": "Integer Break",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Practice Integer Break. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 282,
    "title": "Rod Cutting",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Rod Cutting. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 283,
    "title": "Uncrossed Lines",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Uncrossed Lines. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 284,
    "title": "Longest Common Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Longest Common Subsequence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 285,
    "title": "Longest Palindromic Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Longest Palindromic Subsequence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 286,
    "title": "Minimum ASCII Delete Sum for Two Strings",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Minimum ASCII Delete Sum for Two Strings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 287,
    "title": "Delete Operation for Two Strings",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Delete Operation for Two Strings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 288,
    "title": "Minimum Insertion Steps to Make a String Palindrome",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Minimum Insertion Steps to Make a String Palindrome. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 289,
    "title": "Maximum Sum Circular Subarray",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice Maximum Sum Circular Subarray. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 290,
    "title": "Best Time to Buy and Sell Stock II",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Best Time to Buy and Sell Stock II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 291,
    "title": "Best Time to Buy and Sell Stock III",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Best Time to Buy and Sell Stock III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 292,
    "title": "Best Time to Buy and Sell Stock IV",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice Best Time to Buy and Sell Stock IV. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 293,
    "title": "Best Time to Buy and Sell Stock with Cooldown",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Best Time to Buy and Sell Stock with Cooldown. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 294,
    "title": "Best Time to Buy and Sell Stock with Transaction Fee",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Best Time to Buy and Sell Stock with Transaction Fee. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 295,
    "title": "Longest Turbulent Subarray",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Longest Turbulent Subarray. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 296,
    "title": "Wiggle Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Wiggle Subsequence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 297,
    "title": "Arithmetic Slices",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Arithmetic Slices. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 298,
    "title": "Count Number of Teams",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Count Number of Teams. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 299,
    "title": "Maximum Alternating Subsequence Sum",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice Maximum Alternating Subsequence Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 300,
    "title": "Maximum Subarray Min-Product",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice Maximum Subarray Min-Product. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 301,
    "title": "Tribonacci Number",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Tribonacci Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 302,
    "title": "N-th Tribonacci Number",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice N-th Tribonacci Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 303,
    "title": "Pascal's Triangle",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Pascal's Triangle. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 304,
    "title": "Pascal's Triangle II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Pascal's Triangle II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 305,
    "title": "Triangle",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Triangle. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 306,
    "title": "Minimum Path Sum",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Minimum Path Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 307,
    "title": "Unique Paths II",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Unique Paths II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 308,
    "title": "Dungeon Game",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Dungeon Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 309,
    "title": "Cherry Pickup",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Cherry Pickup. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 310,
    "title": "Cherry Pickup II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Cherry Pickup II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 311,
    "title": "Out of Boundary Paths",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Out of Boundary Paths. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 312,
    "title": "Knight Probability in Chessboard",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Knight Probability in Chessboard. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 313,
    "title": "Number of Dice Rolls With Target Sum",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Number of Dice Rolls With Target Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 314,
    "title": "Soup Servings",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Soup Servings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 315,
    "title": "Domino and Tromino Tiling",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Domino and Tromino Tiling. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 316,
    "title": "Paint House",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Practice Paint House. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 317,
    "title": "Paint House II",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Paint House II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 318,
    "title": "Paint Fence",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Paint Fence. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 319,
    "title": "Student Attendance Record II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Student Attendance Record II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 320,
    "title": "Maximum Profit in Job Scheduling",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Maximum Profit in Job Scheduling. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 321,
    "title": "Weighted Job Scheduling",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Weighted Job Scheduling. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 322,
    "title": "Minimum Cost For Tickets",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Minimum Cost For Tickets. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 323,
    "title": "Delete and Earn",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Delete and Earn. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 324,
    "title": "Maximum Points You Can Obtain from Cards",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Maximum Points You Can Obtain from Cards. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 325,
    "title": "Stone Game",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Practice Stone Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 326,
    "title": "Stone Game II",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Stone Game II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 327,
    "title": "Stone Game III",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice Stone Game III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 328,
    "title": "Predict the Winner",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Predict the Winner. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 329,
    "title": "Can I Win",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Can I Win. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 330,
    "title": "Guess Number Higher or Lower II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Guess Number Higher or Lower II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 331,
    "title": "Egg Drop With 2 Eggs and 100 Floors",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Practice Egg Drop With 2 Eggs and 100 Floors. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 332,
    "title": "Super Egg Drop",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Practice Super Egg Drop. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 333,
    "title": "Burst Balloons DP",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Burst Balloons DP. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 334,
    "title": "Count Vowels Permutation",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Count Vowels Permutation. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 335,
    "title": "Longest String Chain",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Longest String Chain. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 336,
    "title": "Minimum Falling Path Sum",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Minimum Falling Path Sum. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 337,
    "title": "Maximum Square Area",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Maximum Square Area. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 338,
    "title": "Number of Ways to Stay in the Same Place",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Practice Number of Ways to Stay in the Same Place. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 339,
    "title": "Grid Game",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Grid Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 340,
    "title": "Minimum Difficulty of a Job Schedule",
    "topic": "Greedy",
    "difficulty": "Easy",
    "description": "Practice Minimum Difficulty of a Job Schedule. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 341,
    "title": "Minimum Number of Refueling Stops",
    "topic": "Greedy",
    "difficulty": "Easy",
    "description": "Practice Minimum Number of Refueling Stops. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 342,
    "title": "Shortest Path in Binary Matrix",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "Practice Shortest Path in Binary Matrix. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 343,
    "title": "Max Area of Island",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "Practice Max Area of Island. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 344,
    "title": "Island Perimeter",
    "topic": "Graphs",
    "difficulty": "Easy",
    "description": "Practice Island Perimeter. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 345,
    "title": "Surrounded Regions",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Surrounded Regions. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 346,
    "title": "Pacific Atlantic Water Flow",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Pacific Atlantic Water Flow. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 347,
    "title": "Clone Graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Clone Graph. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 348,
    "title": "Course Schedule",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Course Schedule. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 349,
    "title": "Course Schedule II",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Course Schedule II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 350,
    "title": "Graph Valid Tree",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Graph Valid Tree. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 351,
    "title": "Number of Connected Components in an Undirected Graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Number of Connected Components in an Undirected Graph. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 352,
    "title": "Redundant Connection",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Redundant Connection. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 353,
    "title": "Accounts Merge",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Accounts Merge. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 354,
    "title": "Evaluate Division",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Evaluate Division. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 355,
    "title": "Possible Bipartition",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Possible Bipartition. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 356,
    "title": "Is Graph Bipartite?",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Is Graph Bipartite?. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 357,
    "title": "Is Graph Bipartite? II",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Is Graph Bipartite? II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 358,
    "title": "Find if Path Exists in Graph",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "Practice Find if Path Exists in Graph. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 359,
    "title": "Keys and Rooms",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Keys and Rooms. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 360,
    "title": "Reconstruct Itinerary",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Reconstruct Itinerary. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 361,
    "title": "Word Ladder",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Word Ladder. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 362,
    "title": "Word Ladder II",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Word Ladder II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 363,
    "title": "Open the Lock",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Open the Lock. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 364,
    "title": "Minimum Genetic Mutation",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Minimum Genetic Mutation. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 365,
    "title": "Network Delay Time",
    "topic": "Graphs",
    "difficulty": "Easy",
    "description": "Practice Network Delay Time. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 366,
    "title": "Cheapest Flights Within K Stops",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Cheapest Flights Within K Stops. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 367,
    "title": "Path With Minimum Effort",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Path With Minimum Effort. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 368,
    "title": "Swim in Rising Water",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Swim in Rising Water. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 369,
    "title": "Critical Connections in a Network",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Critical Connections in a Network. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 370,
    "title": "Min Cost to Connect All Points",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Min Cost to Connect All Points. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 371,
    "title": "Connecting Cities With Minimum Cost",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Connecting Cities With Minimum Cost. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 372,
    "title": "Find the City With the Smallest Number of Neighbors",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Find the City With the Smallest Number of Neighbors. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 373,
    "title": "All Paths From Source to Target",
    "topic": "Backtracking",
    "difficulty": "Easy",
    "description": "Practice All Paths From Source to Target. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 374,
    "title": "Shortest Path Visiting All Nodes",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "Practice Shortest Path Visiting All Nodes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 375,
    "title": "Bus Routes",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Bus Routes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 376,
    "title": "Snakes and Ladders",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Snakes and Ladders. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 377,
    "title": "Rotting Oranges",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Rotting Oranges. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 378,
    "title": "Walls and Gates",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Walls and Gates. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 379,
    "title": "01 Matrix",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Practice 01 Matrix. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 380,
    "title": "As Far from Land as Possible",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice As Far from Land as Possible. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 381,
    "title": "Nearest Exit from Entrance in Maze",
    "topic": "Backtracking",
    "difficulty": "Hard",
    "description": "Practice Nearest Exit from Entrance in Maze. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 382,
    "title": "Minimum Knight Moves",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Minimum Knight Moves. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 383,
    "title": "Jump Game III",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Jump Game III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 384,
    "title": "Jump Game IV",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Jump Game IV. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 385,
    "title": "Jump Game V",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Jump Game V. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 386,
    "title": "Jump Game VI",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Jump Game VI. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 387,
    "title": "Jump Game VII",
    "topic": "Greedy",
    "difficulty": "Hard",
    "description": "Practice Jump Game VII. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 388,
    "title": "Find Eventual Safe States",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Find Eventual Safe States. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 389,
    "title": "Keys and Rooms II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Keys and Rooms II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 390,
    "title": "Reorder Routes to Make All Paths Lead to the City Zero",
    "topic": "Backtracking",
    "difficulty": "Medium",
    "description": "Practice Reorder Routes to Make All Paths Lead to the City Zero. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 391,
    "title": "Minimum Number of Vertices to Reach All Nodes",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Minimum Number of Vertices to Reach All Nodes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 392,
    "title": "Find Center of Star Graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Practice Find Center of Star Graph. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 393,
    "title": "Count Servers that Communicate",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Count Servers that Communicate. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 394,
    "title": "Number of Provinces",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "Practice Number of Provinces. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 395,
    "title": "Town Judge",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Town Judge. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 396,
    "title": "Find the Celebrity",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Find the Celebrity. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 397,
    "title": "Flood Fill II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Flood Fill II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 398,
    "title": "Islands and Treasure",
    "topic": "Graphs",
    "difficulty": "Easy",
    "description": "Practice Islands and Treasure. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 399,
    "title": "Surrounded Regions II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Surrounded Regions II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 400,
    "title": "Detect Cycles in 2D Grid",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Detect Cycles in 2D Grid. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 401,
    "title": "Make a Large Island",
    "topic": "Graphs",
    "difficulty": "Easy",
    "description": "Practice Make a Large Island. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 402,
    "title": "Shortest Bridge",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Shortest Bridge. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 403,
    "title": "Word Search III",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Word Search III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 404,
    "title": "Implement Trie (Prefix Tree)",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Practice Implement Trie (Prefix Tree). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 405,
    "title": "Design Add and Search Words Data Structure",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Design Add and Search Words Data Structure. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 406,
    "title": "Search Suggestions System",
    "topic": "Searching",
    "difficulty": "Easy",
    "description": "Practice Search Suggestions System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 407,
    "title": "Replace Words",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Replace Words. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 408,
    "title": "Map Sum Pairs",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Map Sum Pairs. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 409,
    "title": "Longest Word in Dictionary",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Longest Word in Dictionary. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 410,
    "title": "Stream of Characters",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Stream of Characters. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 411,
    "title": "Prefix and Suffix Search",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Prefix and Suffix Search. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 412,
    "title": "Word Squares",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Word Squares. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 413,
    "title": "Concatenated Words",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Concatenated Words. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 414,
    "title": "Distinct Subsequences II",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Distinct Subsequences II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 415,
    "title": "Count Prefix and Suffix Pairs",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Practice Count Prefix and Suffix Pairs. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 416,
    "title": "Trie Serialization",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Trie Serialization. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 417,
    "title": "Design Search Autocomplete System",
    "topic": "Searching",
    "difficulty": "Medium",
    "description": "Practice Design Search Autocomplete System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 418,
    "title": "Implement Magic Dictionary",
    "topic": "Design",
    "difficulty": "Easy",
    "description": "Practice Implement Magic Dictionary. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 419,
    "title": "Maximum XOR of Two Numbers in an Array",
    "topic": "Bit Manipulation",
    "difficulty": "Hard",
    "description": "Practice Maximum XOR of Two Numbers in an Array. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 420,
    "title": "Maximum XOR With an Element From Array",
    "topic": "Bit Manipulation",
    "difficulty": "Hard",
    "description": "Practice Maximum XOR With an Element From Array. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 421,
    "title": "Bitwise AND of Numbers Range",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "description": "Practice Bitwise AND of Numbers Range. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 422,
    "title": "Counting Bits",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "description": "Practice Counting Bits. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 423,
    "title": "Missing Number II",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Missing Number II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 424,
    "title": "Sum of Two Integers",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Practice Sum of Two Integers. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 425,
    "title": "Happy Number",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Happy Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 426,
    "title": "Excel Sheet Column Number",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Excel Sheet Column Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 427,
    "title": "Excel Sheet Column Title",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Excel Sheet Column Title. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 428,
    "title": "Factorial Trailing Zeroes",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Practice Factorial Trailing Zeroes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 429,
    "title": "Add Digits",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Add Digits. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 430,
    "title": "Ugly Number",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Ugly Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 431,
    "title": "Ugly Number II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Ugly Number II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 432,
    "title": "Count Primes",
    "topic": "Math",
    "difficulty": "Medium",
    "description": "Practice Count Primes. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 433,
    "title": "Sqrt(x)",
    "topic": "Math",
    "difficulty": "Hard",
    "description": "Practice Sqrt(x). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 434,
    "title": "Pow(x, n)",
    "topic": "Math",
    "difficulty": "Hard",
    "description": "Practice Pow(x, n). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 435,
    "title": "Divide Two Integers",
    "topic": "Math",
    "difficulty": "Hard",
    "description": "Practice Divide Two Integers. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 436,
    "title": "Fraction to Recurring Decimal",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Fraction to Recurring Decimal. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 437,
    "title": "Integer to Roman",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Practice Integer to Roman. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 438,
    "title": "Roman to Integer",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Roman to Integer. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 439,
    "title": "Number of 1 Bits II",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "description": "Practice Number of 1 Bits II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 440,
    "title": "Bitwise ORs of Subarrays",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Practice Bitwise ORs of Subarrays. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 441,
    "title": "Total Hamming Distance",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "description": "Practice Total Hamming Distance. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 442,
    "title": "Single Number II",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Single Number II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 443,
    "title": "Single Number III",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Single Number III. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 444,
    "title": "Power of Three",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "description": "Practice Power of Three. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 445,
    "title": "Power of Four",
    "topic": "Bit Manipulation",
    "difficulty": "Easy",
    "description": "Practice Power of Four. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 446,
    "title": "Perfect Number",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Perfect Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 447,
    "title": "Bulb Switcher",
    "topic": "Math",
    "difficulty": "Medium",
    "description": "Practice Bulb Switcher. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 448,
    "title": "Reach a Number",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Reach a Number. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 449,
    "title": "Integer Replacement",
    "topic": "Math",
    "difficulty": "Easy",
    "description": "Practice Integer Replacement. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 450,
    "title": "Elimination Game",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Elimination Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 451,
    "title": "Mirror Reflection",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Mirror Reflection. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 452,
    "title": "Water and Jug Problem",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Water and Jug Problem. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 453,
    "title": "Random Pick with Weight",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Random Pick with Weight. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 454,
    "title": "Random Pick Index",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Random Pick Index. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 455,
    "title": "Shuffle an Array",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Shuffle an Array. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 456,
    "title": "Reservoir Sampling",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Reservoir Sampling. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 457,
    "title": "Random Point in Non-overlapping Rectangles",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Random Point in Non-overlapping Rectangles. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 458,
    "title": "Implement Rand10() Using Rand7()",
    "topic": "Design",
    "difficulty": "Easy",
    "description": "Practice Implement Rand10() Using Rand7(). Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 459,
    "title": "Design Twitter",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Twitter. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 460,
    "title": "Design Underground System",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Underground System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 461,
    "title": "Design Browser History",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Browser History. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 462,
    "title": "Design Parking System",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Parking System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 463,
    "title": "Design Tic-Tac-Toe",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Tic-Tac-Toe. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 464,
    "title": "Design Snake Game",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Snake Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 465,
    "title": "Design Hit Counter",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Design Hit Counter. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 466,
    "title": "Logger Rate Limiter",
    "topic": "Design",
    "difficulty": "Easy",
    "description": "Practice Logger Rate Limiter. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 467,
    "title": "Moving Average from Data Stream",
    "topic": "Queue",
    "difficulty": "Hard",
    "description": "Practice Moving Average from Data Stream. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 468,
    "title": "Summary Ranges",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Practice Summary Ranges. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 469,
    "title": "Insert Delete GetRandom O(1) - Duplicates Allowed",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Insert Delete GetRandom O(1) - Duplicates Allowed. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 470,
    "title": "Find Duplicate File in System",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Practice Find Duplicate File in System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 471,
    "title": "Encode and Decode Strings",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Practice Encode and Decode Strings. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 472,
    "title": "Find Median from Data Stream II",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Find Median from Data Stream II. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 473,
    "title": "Design a Leaderboard",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design a Leaderboard. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 474,
    "title": "Design a Food Rating System",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design a Food Rating System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 475,
    "title": "Design a Number Container System",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design a Number Container System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 476,
    "title": "Design Task Manager",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Task Manager. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 477,
    "title": "Design Spreadsheet",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Spreadsheet. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 478,
    "title": "Design Movie Rental System",
    "topic": "Design",
    "difficulty": "Hard",
    "description": "Practice Design Movie Rental System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 479,
    "title": "Design Authentication Manager",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Authentication Manager. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 480,
    "title": "Design Circular Deque",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Design Circular Deque. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 481,
    "title": "Design Front Middle Back Queue",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Design Front Middle Back Queue. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 482,
    "title": "Design Skiplist",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Skiplist. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 483,
    "title": "Design Ordered Stream",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Design Ordered Stream. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 484,
    "title": "Design an ATM Machine",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design an ATM Machine. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 485,
    "title": "Design Bitset",
    "topic": "Bit Manipulation",
    "difficulty": "Medium",
    "description": "Practice Design Bitset. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 486,
    "title": "Design Memory Allocator",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design Memory Allocator. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 487,
    "title": "Design Neighbor Sum Service",
    "topic": "Design",
    "difficulty": "Hard",
    "description": "Practice Design Neighbor Sum Service. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 488,
    "title": "Design a Stack With Increment Operation",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Practice Design a Stack With Increment Operation. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 489,
    "title": "Design Most Recently Used Queue",
    "topic": "Queue",
    "difficulty": "Medium",
    "description": "Practice Design Most Recently Used Queue. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 490,
    "title": "Design a File Sharing System",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design a File Sharing System. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 491,
    "title": "Design a Text Editor",
    "topic": "Design",
    "difficulty": "Hard",
    "description": "Practice Design a Text Editor. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 492,
    "title": "Design a Map",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design a Map. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 493,
    "title": "Design a Set",
    "topic": "Design",
    "difficulty": "Medium",
    "description": "Practice Design a Set. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 494,
    "title": "Find the Winner of the Circular Game",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Find the Winner of the Circular Game. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 495,
    "title": "Josephus Problem",
    "topic": "Algorithms",
    "difficulty": "Medium",
    "description": "Practice Josephus Problem. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 496,
    "title": "Queue Reconstruction by Height",
    "topic": "Queue",
    "difficulty": "Easy",
    "description": "Practice Queue Reconstruction by Height. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 497,
    "title": "Reconstruct Queue by Height",
    "topic": "Queue",
    "difficulty": "Easy",
    "description": "Practice Reconstruct Queue by Height. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 498,
    "title": "Minimum Number of Platforms",
    "topic": "Greedy",
    "difficulty": "Medium",
    "description": "Practice Minimum Number of Platforms. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 499,
    "title": "Activity Selection",
    "topic": "Algorithms",
    "difficulty": "Hard",
    "description": "Practice Activity Selection. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  },
  {
    "id": 500,
    "title": "Job Sequencing with Deadlines",
    "topic": "Algorithms",
    "difficulty": "Easy",
    "description": "Practice Job Sequencing with Deadlines. Read the problem statement carefully, choose an efficient algorithm, and print the required result.",
    "example": "See the problem statement for the required input and output.",
    "output": "Expected output depends on the problem input.",
    "inputFormat": "__NEEDS_LEARNING_GUIDE__",
    "testCases": []
  }
];

// Plain-language learning support for catalog entries whose original statement,
// sample input/output, and verified tests were not included in the source data.
function getProblemLearningGuide(problem) {
  const title = problem?.title || "this problem";
  const topic = problem?.topic || "Algorithms";
  const titleLower = title.toLowerCase();

  const exactGuides = {
    "Dungeon Game": {
      summary: "A hero starts in the top-left cell of a dungeon and must reach the princess in the bottom-right cell. Each cell can increase health (positive number) or reduce it (negative number). The hero may move only right or down, and health must never fall below 1.",
      goal: "Find the minimum starting health that guarantees the hero can reach the bottom-right cell alive.",
      approach: "Work backward from the destination. For each cell, calculate the minimum health needed to enter it so that after applying that cell's value, the hero still has enough health for the best next move. Compare the right and down paths.",
      edgeCases: "A one-cell dungeon; all-positive cells; large negative values; the best route may not be the shortest-looking route."
    },
    "4Sum": { summary: "Given a list of integers and a target, find every unique group of four different positions whose values add up to the target.", goal: "Return each valid quadruplet once; do not return duplicate quadruplets.", approach: "Sort the array, fix two values, then use two pointers to search for the remaining pair. Skip repeated values and use a sufficiently wide sum type when needed.", edgeCases: "Fewer than four values, repeated numbers, negative numbers, and multiple combinations with the same values." },
    "3Sum Closest": { summary: "Given an integer array and a target, choose three values whose sum is as close as possible to the target.", goal: "Return the sum of the three chosen values with the smallest absolute difference from the target.", approach: "Sort the array, fix one value, and move two pointers inward depending on whether the current sum is too small or too large.", edgeCases: "Exactly three values, negative values, and sums on either side of the target." },
    "Trapping Rain Water": { summary: "Each array value is the height of a vertical bar. After rain, water can collect between taller bars.", goal: "Calculate the total number of water units trapped between the bars.", approach: "For each position, the water level depends on the tallest bar to its left and right. Use two pointers or precomputed left/right maxima to calculate the total efficiently.", edgeCases: "An empty or very short array, flat bars, and bars that cannot trap water." },
    "Jump Game": { summary: "Each array value tells you the maximum number of positions you may jump forward from that index.", goal: "Determine whether the last index can be reached from the first index.", approach: "Track the farthest index reachable so far. If the current index is beyond that reach, progress is impossible.", edgeCases: "A single-element array, a zero that blocks progress, and jumps that reach beyond the last index." },
    "Jump Game II": { summary: "Each array value is the maximum forward jump length from that position. Assume the last index is reachable.", goal: "Find the minimum number of jumps needed to reach the last index.", approach: "Scan the current jump range while tracking the farthest next reach; increase the jump count when the current range ends.", edgeCases: "A single-element array, large jumps, and positions with jump length zero." },
    "Gas Station": { summary: "Stations form a circular route. Each station provides some fuel and travelling to the next station consumes fuel.", goal: "Find a starting station that lets the car complete the whole circuit, or return -1 if no start works.", approach: "Compare total fuel with total cost first. If the running fuel balance becomes negative, the current candidate start cannot work, so choose the next station.", edgeCases: "Only one station, total fuel below total cost, and a valid start near the end of the array." },
    "First Missing Positive": { summary: "Given an unsorted integer array, find the smallest positive integer (1, 2, 3, ...) that does not appear in it.", goal: "Return the first missing positive integer.", approach: "The answer must be between 1 and n+1 for an array of length n. Place values in their matching index positions when possible, then scan for the first mismatch.", edgeCases: "Negative numbers, zero, duplicates, and an array containing every value from 1 through n." },
    "Find the Duplicate Number": { summary: "An array contains n+1 values, each between 1 and n, so at least one value is repeated.", goal: "Find a duplicate value without modifying the array when the problem's constraints require it.", approach: "Use the value-to-next-index relationship as a cycle, or use binary search on the value range. Choose the method that matches the memory and mutation constraints.", edgeCases: "A duplicate repeated more than twice and arrays with many distinct values." },
    "Next Permutation": { summary: "Rearrange the numbers into the next lexicographically greater ordering. If no greater ordering exists, use the smallest ordering.", goal: "Modify the sequence in place to its next permutation.", approach: "Find the rightmost increasing pair, swap the first value with the smallest greater value to its right, then reverse the suffix.", edgeCases: "A fully descending sequence, a fully ascending sequence, and repeated values." },
    "Coin Change II": { summary: "You are given coin denominations and a target amount. Coins of each denomination may be used repeatedly.", goal: "Count how many different combinations make the target amount, ignoring the order of coins.", approach: "Use dynamic programming where dp[x] counts combinations for amount x. Process one denomination at a time so different coin orders are not counted separately.", edgeCases: "Amount zero, an amount that cannot be formed, and denominations larger than the target." },
    "Minimum Path Sum": { summary: "A grid contains non-negative costs. Start at the top-left and reach the bottom-right by moving only right or down.", goal: "Find the path with the smallest sum of visited cell values.", approach: "For each cell, add its cost to the smaller of the best cost from above or from the left.", edgeCases: "A one-cell grid, a single row or column, and different path costs." },
    "Unique Paths II": { summary: "A grid has open cells and blocked cells. Start at the top-left and move only right or down to the bottom-right.", goal: "Count the paths that avoid every blocked cell.", approach: "Use dynamic programming to count paths reaching each open cell. A blocked cell has zero paths; the start cell is initialized only if it is open.", edgeCases: "A blocked start or finish, a one-cell grid, and narrow grids." },
  };

  const known = exactGuides[title];
  if (known) return known;

  let summary;
  if (/binary tree|bst|subtree|ancestor|tree/i.test(title) || /tree/i.test(topic)) {
    summary = `This problem is about a tree: a structure made of nodes connected by parent-child links. For “${title}”, identify which node values, paths, levels, or structural property must be found, then process the tree without visiting nodes unnecessarily.`;
  } else if (/graph|island|course|path|network|route|rooms|connected|bipartite|flight|bridge|province/i.test(title) || /graph/i.test(topic)) {
    summary = `Treat the input as a graph of vertices and connections. In “${title}”, determine the required reachability, grouping, ordering, or cheapest/shortest route, based on the problem's exact conditions.`;
  } else if (/substring|string|word|anagram|parentheses|palindrome|character|pattern|text|prefix|suffix|expression/i.test(title) || /string/i.test(topic)) {
    summary = `This is a string-processing problem. For “${title}”, examine characters in order and determine the requested substring, transformation, match, count, or validity result. Pay attention to whether matching is case-sensitive and whether repeated characters are allowed.`;
  } else if (/subsequence|knapsack|coin change|robber|ways|minimum cost|maximum profit|falling path|edit distance|decode ways|longest increasing|distinct subsequences|dungeon|burst balloons|paint house|tribonacci|fibonacci/i.test(title) || /dynamic programming/i.test(topic)) {
    summary = `This problem commonly benefits from dynamic programming. For “${title}”, define what a smaller subproblem represents, determine how its result depends on earlier states, and use those states to build the final answer.`;
  } else if (/array|sum|number|sort|rotate|matrix|interval|window|stock|element|missing|duplicate|median|rectangle|height|range/i.test(title) || /array|two pointers|sliding window|sorting/i.test(topic)) {
    summary = `You are working with a collection of values. In “${title}”, identify the exact value, group, range, ordering, or count requested. Consider whether sorting, a hash map/set, two pointers, or a running total can reduce repeated work.`;
  } else if (/design|implement|cache|stack|queue|map|set|trie|stream|system|iterator|randomized/i.test(title) || /design|stack|queue|trie|data structure/i.test(topic)) {
    summary = `This is a data-structure design problem. For “${title}”, implement the operations described by the task and make sure each operation updates and reads the stored state correctly. Check the required performance for each operation.`;
  } else if (/bit|xor|power|integer|roman|factorial|prime|gcd|sqrt|divide|hamming|binary/i.test(title) || /math|bit/i.test(topic)) {
    summary = `This is a mathematical or bit-manipulation problem. For “${title}”, translate the requirement into a precise numerical rule, handle sign and boundary cases, and avoid overflow where values may be large.`;
  } else {
    summary = `Solve “${title}” by first identifying exactly what the input represents and what result the task asks you to produce. Break the task into smaller steps, select an appropriate algorithm for the ${topic.toLowerCase()} topic, and verify it against boundary cases.`;
  }

  const goal = `Produce the result required by “${title}”. Return the exact value, sequence, count, path, or data-structure behavior requested by the problem; do not print extra labels unless the statement explicitly asks for them.`;
  let approach;
  if (/tree/i.test(topic) || /tree|ancestor|subtree/i.test(title)) approach = "Start from the root or required node, decide whether preorder, inorder, postorder, level-order, recursion, or an iterative stack/queue fits the task, and define how null children are handled.";
  else if (/graph/i.test(topic) || /graph|island|course|network|route|rooms|province|flight/i.test(title)) approach = "Model connections explicitly. Use BFS/DFS for reachability and components; use a shortest-path or topological-order algorithm only when its assumptions match the problem.";
  else if (/dynamic programming/i.test(topic) || /subsequence|knapsack|coin change|robber|ways|minimum cost|maximum profit|dungeon|edit distance/i.test(title)) approach = "Define a state in one sentence, write the transition from smaller states, set correct base cases, then evaluate states in an order where dependencies are already known.";
  else if (/string/i.test(topic) || /string|substring|word|anagram|palindrome|parentheses|character|pattern|prefix|suffix/i.test(title)) approach = "Write down what counts as a match and whether characters can repeat or be skipped. A frequency map, two pointers, a sliding window, or a stack may help depending on the requirement.";
  else if (/stack|queue|design|trie|data structure/i.test(topic) || /design|cache|stack|queue|map|set|trie|stream/i.test(title)) approach = "List the supported operations, what state each operation changes, and the expected result. Test operations in sequence, including empty and repeated-use cases.";
  else approach = "Work through a small example by hand, then choose a direct approach. Check whether sorting, a hash map/set, two pointers, binary search, or a running dynamic state improves efficiency.";

  return {
    summary,
    goal,
    approach,
    edgeCases: "Check the smallest valid input, repeated values, negative or zero values when allowed, already-sorted/reversed input, and cases where no valid result exists. Follow the actual problem constraints when deciding which cases apply."
  };
}

// Improve every catalog entry that arrived without a verified statement/sample.
// Keep the existing learning guide visible and avoid pretending unverified tests are real.
for (const problem of problems) {
  if (problem && (problem.inputFormat === "__NEEDS_LEARNING_GUIDE__" || (Array.isArray(problem.testCases) && problem.testCases.length === 0))) {
    const guide = getProblemLearningGuide(problem);
    problem.description = `${guide.summary}\n\nGoal: ${guide.goal}\n\nHow to solve: ${guide.approach}\n\nEdge cases: ${guide.edgeCases}`;
    problem.inputFormat = "Input format and output formatting must be confirmed for this catalog problem before automatic judging is enabled.";
    if (!problem.example || problem.example.includes("See the problem statement")) {
      problem.example = "Verified sample input is not available in the current local catalog.";
    }
    if (!problem.output || problem.output.includes("depends on the problem input")) {
      problem.output = "Verified sample output is not available in the current local catalog.";
    }
  }
}

const roadmapModules = [
  {
    title: "Programming Fundamentals",
    description: "Variables, data types, conditions and loops",
    progress: 0,
    lessons: ["Understand variables and data types", "Use if/else conditions", "Practice loops and basic input/output"],
    quiz: [
      { question: "Which type stores a whole number in Java?", options: ["int", "boolean", "String"], answer: 0 },
      { question: "Which structure repeats code while a condition is true?", options: ["if", "loop", "class"], answer: 1 },
      { question: "Which operator checks equality for primitive values in Java?", options: ["=", "==", "=>"], answer: 1 }
    ],
    relatedTopics: ["Programming", "Basics", "General", "Math", "Arrays", "Strings"],
  },
  {
    title: "Arrays and Strings",
    description: "Array operations and string manipulation",
    progress: 0,
    lessons: ["Access and update array elements", "Traverse arrays with loops", "Use common string operations"],
    quiz: [
      { question: "What is the index of the first element in a Java array?", options: ["0", "1", "-1"], answer: 0 },
      { question: "Which property gives the length of a Java array?", options: ["size()", "length", "count"], answer: 1 },
      { question: "Strings in Java are generally...", options: ["Mutable", "Immutable", "Numeric"], answer: 1 }
    ],
    relatedTopics: ["Arrays", "Array", "Strings", "String"],
  },
  {
    title: "Searching and Sorting",
    description: "Binary search and sorting algorithms",
    progress: 0,
    lessons: ["Compare linear and binary search", "Learn why binary search needs sorted data", "Practice basic sorting algorithms"],
    quiz: [
      { question: "Binary search requires the input to be...", options: ["Sorted", "Reversed", "Unique only"], answer: 0 },
      { question: "Binary search time complexity is typically...", options: ["O(n)", "O(log n)", "O(n²)"], answer: 1 },
      { question: "Which is a sorting algorithm?", options: ["Merge sort", "Binary search", "BFS only"], answer: 0 }
    ],
    relatedTopics: ["Searching", "Sorting", "Binary Search"],
  },
  {
    title: "Stacks and Queues",
    description: "Linear data structures",
    progress: 0,
    lessons: ["Understand LIFO and FIFO", "Practice push/pop operations", "Practice enqueue/dequeue operations"],
    quiz: [
      { question: "A stack follows which order?", options: ["FIFO", "LIFO", "Random"], answer: 1 },
      { question: "A queue usually removes the...", options: ["Newest item", "Oldest item", "Largest item"], answer: 1 },
      { question: "Which operation adds an item to a stack?", options: ["push", "pop", "dequeue"], answer: 0 }
    ],
    relatedTopics: ["Stack", "Stacks", "Queue", "Queues"],
  },
  {
    title: "Recursion and Trees",
    description: "Recursive thinking and tree traversal",
    progress: 0,
    lessons: ["Identify base cases in recursion", "Trace recursive calls", "Understand tree traversal basics"],
    quiz: [
      { question: "A recursive function must eventually reach a...", options: ["Base case", "Queue", "Hash collision"], answer: 0 },
      { question: "Which traversal visits root, left, right?", options: ["Inorder", "Preorder", "Postorder"], answer: 1 },
      { question: "A tree is commonly made of...", options: ["Nodes and edges", "Only arrays", "Only strings"], answer: 0 }
    ],
    relatedTopics: ["Recursion", "Tree", "Trees"],
  },
  {
    title: "Graphs and Dynamic Programming",
    description: "Advanced problem-solving techniques",
    progress: 0,
    lessons: ["Understand vertices and edges", "Learn BFS/DFS at a high level", "Recognize overlapping subproblems in DP"],
    quiz: [
      { question: "A graph consists primarily of...", options: ["Vertices and edges", "Rows and columns only", "Functions only"], answer: 0 },
      { question: "BFS commonly uses a...", options: ["Queue", "Stack only", "Binary heap only"], answer: 0 },
      { question: "Dynamic programming is useful when subproblems...", options: ["Overlap", "Never repeat", "Have no result"], answer: 0 }
    ],
    relatedTopics: ["Graph", "Graphs", "Dynamic Programming", "DP"],
  },
];

const initialJavaCode = `class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`;

const initialCCode = `#include <stdio.h>\n\nint main(void) {\n    printf("Hello World\\n");\n    return 0;\n}`;

const initialCppCode = `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}`;

function Icon({ children }) {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

function handleEditorMount(editor, monaco) {
  monaco.languages.registerHoverProvider("java", {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position);

      if (!word) return null;

      const explanation = CODE_EXPLANATIONS.java[word.word];

      if (!explanation) return null;

      return {
        contents: [{ value: `**${word.word}**\n\n${explanation}` }],
      };
    },
  });

  monaco.languages.registerHoverProvider("c", {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const explanation = CODE_EXPLANATIONS.c[word.word];
      if (!explanation) return null;

      return {
        contents: [{ value: `**${word.word}**\n\n${explanation}` }],
      };
    },
  });

  monaco.languages.registerHoverProvider("cpp", {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position);

      if (!word) return null;

      const explanation = CODE_EXPLANATIONS.cpp[word.word];

      if (!explanation) return null;

      return {
        contents: [{ value: `**${word.word}**\n\n${explanation}` }],
      };
    },
  });
    ["javascript", "python"].forEach((lang) => {
    monaco.languages.registerHoverProvider(lang, {
      provideHover(model, position) {
        const word = model.getWordAtPosition(position);

        if (!word) return null;

        const explanation = CODE_EXPLANATIONS[lang]?.[word.word];

        if (!explanation) return null;

        return {
          contents: [
            {
              value: `**${word.word}**\n\n${explanation}`,
            },
          ],
        };
      },
    });
  });
}

function App() {
  const [activePage, setActivePageState] = useState("Dashboard");

  // Keep the app's internal pages in browser history so Back returns
  // to the previous CodeMentor page instead of leaving the site.
  const setActivePage = (page) => {
    const nextPage = typeof page === "function" ? page(activePage) : page;

    if (nextPage === activePage) return;

    window.history.pushState(
      { ...(window.history.state || {}), codeMentorPage: nextPage },
      "",
      window.location.href
    );
    setActivePageState(nextPage);
  };

  useEffect(() => {
    const initialState = {
      ...(window.history.state || {}),
      codeMentorPage: "Dashboard",
    };

    // Replace the current entry and add an in-app base entry.
    window.history.replaceState(initialState, "", window.location.href);
    window.history.pushState(
      { ...initialState, codeMentorGuard: true },
      "",
      window.location.href
    );

    const handlePopState = (event) => {
      if (event.state?.codeMentorPage) {
        setActivePageState(event.state.codeMentorPage);
      } else {
        setActivePageState("Dashboard");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [authPage, setAuthPage] = useState("login");
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem("token") &&
        localStorage.getItem("user")
    );
  });

  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");

  const [userProgress, setUserProgress] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [problemStatusFilter, setProblemStatusFilter] = useState("All");

  const [selectedProblem, setSelectedProblem] = useState(null);

  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(initialJavaCode);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [allSubmissionEntries, setAllSubmissionEntries] = useState([]);
  const [submissionFilter, setSubmissionFilter] = useState("All");
  const [submissionLanguageFilter, setSubmissionLanguageFilter] = useState("All");
  const [submissionSearch, setSubmissionSearch] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [isFeedbackLoading, setIsFeedbackLoading] =
    useState(false);
    const [assistantAction, setAssistantAction] = useState("explain");
const [assistantQuestion, setAssistantQuestion] = useState("");
const [assistantResult, setAssistantResult] = useState("");
const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [customRoadmapTopic, setCustomRoadmapTopic] =
    useState("");
  const [customRoadmaps, setCustomRoadmaps] = useState(() => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id || user?._id || "guest";

    return JSON.parse(
      localStorage.getItem(`codementor_custom_roadmaps_${userId}`) || "[]"
    );
  } catch {
    return [];
  }
});

  const [completedModules, setCompletedModules] = useState(() => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?.id || user?._id || "guest";

    return JSON.parse(
      localStorage.getItem(`codementor_completed_modules_${userId}`) || "[]"
    );
  } catch {
    return [];
  }
});

  const [roadmapLearningState, setRoadmapLearningState] = useState({});
  const [expandedRoadmapModule, setExpandedRoadmapModule] = useState(0);

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const userName =
    savedUser?.name ||
    savedUser?.fullName ||
    authName ||
    "Student";

    const currentUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
})();

const userStorageKey = currentUser?.id || currentUser?._id || "guest";
  const [loadedUserStorageKey, setLoadedUserStorageKey] = useState(null);
  const [dailyCoins, setDailyCoins] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);

  // Load the signed-in user's local data whenever the account changes.
  useEffect(() => {
    try {
      const roadmaps = JSON.parse(
        localStorage.getItem(`codementor_custom_roadmaps_${userStorageKey}`) || "[]"
      );
      const modules = JSON.parse(
        localStorage.getItem(`codementor_completed_modules_${userStorageKey}`) || "[]"
      );
      const learning = JSON.parse(
        localStorage.getItem(`codementor_roadmap_learning_${userStorageKey}`) || "{}"
      );

      setCustomRoadmaps(Array.isArray(roadmaps) ? roadmaps : []);
      setCompletedModules(Array.isArray(modules) ? modules : []);
      setRoadmapLearningState(learning && typeof learning === "object" ? learning : {});
    } catch (error) {
      console.error("Could not load user-specific learning data:", error);
      setCustomRoadmaps([]);
      setCompletedModules([]);
    } finally {
      setLoadedUserStorageKey(userStorageKey);
    }
  }, [userStorageKey]);

  // Keep coins and the current daily-solving streak in sync with saved challenges.
  useEffect(() => {
    const updateDailyStats = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem(
  `codementor_beginner_zone_v1_${userStorageKey}`
) || "{}"
        );
        const completed = saved.dailyChallenges || {};
        const solvedDates = new Set(
          Object.keys(completed).filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key))
        );
        const dateKey = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        if (!solvedDates.has(dateKey(cursor))) {
          cursor.setDate(cursor.getDate() - 1);
        }

        let streak = 0;
        while (solvedDates.has(dateKey(cursor))) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        }
        setDailyStreak(streak);

        // Award 10 coins per consecutive coding day, capped at 30 coins.
        // Examples: 1 day = 10, 2 days = 20, 3+ days (including 30 days) = 30.
        setDailyCoins(Math.min(streak * 10, 30));
      } catch {
        setDailyCoins(0);
        setDailyStreak(0);
      }
    };

    updateDailyStats();
    const intervalId = window.setInterval(updateDailyStats, 1000);
    window.addEventListener("storage", updateDailyStats);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", updateDailyStats);
    };
  }, [userStorageKey]);

  useEffect(() => {
    if (loadedUserStorageKey !== userStorageKey) return;

    localStorage.setItem(
      `codementor_custom_roadmaps_${userStorageKey}`,
      JSON.stringify(customRoadmaps)
    );
  }, [customRoadmaps, userStorageKey, loadedUserStorageKey]);

  useEffect(() => {
    if (loadedUserStorageKey !== userStorageKey) return;

    localStorage.setItem(
      `codementor_completed_modules_${userStorageKey}`,
      JSON.stringify(completedModules)
    );
  }, [completedModules, userStorageKey, loadedUserStorageKey]);

  useEffect(() => {
    if (loadedUserStorageKey !== userStorageKey) return;
    localStorage.setItem(
      `codementor_roadmap_learning_${userStorageKey}`,
      JSON.stringify(roadmapLearningState)
    );
  }, [roadmapLearningState, userStorageKey, loadedUserStorageKey]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProgress();
    }
    // Fetch progress when authentication state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  async function handleAuth(event) {
    event.preventDefault();

    setAuthMessage("");
    setAuthError("");

    const email = authEmail.trim().toLowerCase();
    const isSignup = authPage === "signup";
    const isForgotPassword = authPage === "forgot";

    if (!email) {
      setAuthError("Please enter your email address.");
      return;
    }

    if (isForgotPassword) {
      setAuthLoading(true);
      try {
        let response;
        if (forgotStep === 1) {
          response = await axios.post(
            `${API_URL}/api/auth/forgot-password/send-otp`,
            { email }
          );
          setForgotStep(2);
          setAuthMessage(response.data?.message || "If this email is registered, an OTP has been sent to it.");
          setAuthError("");
        } else if (forgotStep === 2) {
          if (!/^\d{6}$/.test(forgotOtp.trim())) {
            setAuthError("Please enter the 6-digit OTP sent to your registered email.");
            setAuthLoading(false);
            return;
          }
          response = await axios.post(
            `${API_URL}/api/auth/forgot-password/verify-otp`,
            { email, otp: forgotOtp.trim() }
          );
          setForgotStep(3);
          setAuthMessage(response.data?.message || "OTP verified. Please set your new password.");
          setAuthError("");
        } else {
          if (newPassword.length < 8) {
            setAuthError("New password must contain at least 8 characters.");
            setAuthLoading(false);
            return;
          }
          if (newPassword !== confirmNewPassword) {
            setAuthError("Passwords do not match.");
            setAuthLoading(false);
            return;
          }
          response = await axios.post(
            `${API_URL}/api/auth/forgot-password/reset-password`,
            { email, otp: forgotOtp.trim(), newPassword }
          );
          setAuthPage("login");
          setForgotStep(1);
          setForgotOtp("");
          setNewPassword("");
          setConfirmNewPassword("");
          setAuthPassword("");
          setAuthMessage(response.data?.message || "Password reset successfully. Please log in with your new password.");
          setAuthError("");
        }
      } catch (error) {
        setAuthError(
          error.response?.data?.message ||
            (error.response?.status === 404
              ? "Email OTP reset API is not set up on the server yet. The backend must send and verify OTPs."
              : "Could not complete password reset. Please try again.")
        );
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    if (!authPassword) {
      setAuthError("Please enter your password.");
      return;
    }

    if (isSignup && !authName.trim()) {
      setAuthError("Please enter your full name.");
      return;
    }

    if (authPassword.length < 8) {
  setAuthError("Password must contain at least 8 characters.");
  return;
}

    setAuthLoading(true);

    try {
      const endpoint = isSignup
  ? `${API_URL}/api/auth/register`
  : `${API_URL}/api/auth/login`;

      const payload = isSignup
        ? {
            name: authName.trim(),
            email,
            password: authPassword,
          }
        : {
            email,
            password: authPassword,
          };

      const response = await axios.post(endpoint, payload);

      if (isSignup) {
        setAuthMessage(
          "Account created successfully! Please log in."
        );

        setAuthPage("login");
        setAuthPassword("");
      } else {
        const token = response.data.token;
        const user = response.data.user;

        if (!token || !user) {
          throw new Error(
            "Login response is missing user or token information."
          );
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // The userStorageKey changes after saving the user. The effects above
        // load this account's own roadmaps and completed modules.
        setIsLoggedIn(true);
setShowAuth(false);
setActivePage("Dashboard");

        setAuthName("");
        setAuthEmail("");
        setAuthPassword("");
        setAuthMessage("");
        setAuthError("");
      }
    } catch (error) {
      setAuthError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please check your backend connection."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsLoggedIn(false);
  setShowAuth(true);
  setAuthPage("login");
  setActivePage("Dashboard");

  setDailyCoins(0);
  setDailyStreak(0);
  setUserProgress([]);

  setAuthName("");
  setAuthEmail("");
  setAuthPassword("");
  setAuthMessage("");
  setAuthError("");
}

  async function fetchUserProgress() {
    try {
      const userString = localStorage.getItem("user");

      if (!userString) return;

      const user = JSON.parse(userString);

      const userId = user?.id || user?._id;
      if (!userId) {
        console.warn("User ID not found. Cannot fetch progress.");
        setUserProgress([]);
        return;
      }

      setProgressLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/progress`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setUserProgress(response.data.progress || []);
    } catch (error) {
      console.error(
        "Failed to fetch user progress:",
        error.response?.data || error.message
      );
    } finally {
      setProgressLoading(false);
    }
  }

  // Derive problem status from this user's saved submissions. A problem is solved
  // only when at least one submission was accepted; failed attempts remain attempted.
  const savedProblemSubmissions = readAllSubmissions();
  const getProblemStatus = (problem) => {
    const saved = savedProblemSubmissions[getProblemSubmissionId(problem)];
    const attempts = Array.isArray(saved?.history)
      ? saved.history
      : saved?.latest
        ? [saved.latest]
        : [];
    if (attempts.some((attempt) => String(attempt?.verdict || attempt?.status || "").trim().toLowerCase() === "accepted" || attempt?.accepted === true)) return "solved";
    if (attempts.length > 0) return "attempted";
    return "unsolved";
  };
  const solvedProblemCount = problems.filter((problem) => getProblemStatus(problem) === "solved").length;
  // AI feedback unlocks once at least one submitted test case passes.
  // Keep the separate solved status for completion badges and dashboard progress.
  const selectedProblemSolved = Boolean(
    selectedProblem && getProblemStatus(selectedProblem) === "solved"
  );
  const selectedProblemHasPassedTestCase = (() => {
    if (!selectedProblem) return false;
    const saved = savedProblemSubmissions[getProblemSubmissionId(selectedProblem)];
    const attempts = Array.isArray(saved?.history)
      ? saved.history
      : saved?.latest
        ? [saved.latest]
        : [];
    return attempts.some((attempt) =>
      Number(attempt?.passed) > 0 ||
      (Array.isArray(attempt?.results) && attempt.results.some((testResult) => testResult?.passed === true))
    );
  })();

  const filteredProblems = problems.filter((problem) => {
    const matchesTopic =
      selectedTopic === "All" ||
      problem.topic === selectedTopic;

    const matchesDifficulty =
      selectedDifficulty === "All" ||
      problem.difficulty === selectedDifficulty;

    const status = getProblemStatus(problem);
    const matchesStatus = problemStatusFilter === "All" ||
      (problemStatusFilter === "Solved" && status === "solved") ||
      (problemStatusFilter === "Todo" && status !== "solved");

    const matchesSearch = [
      String(problem.id),
      `#${problem.id}`,
      problem.title,
      problem.topic,
      problem.description,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchesTopic &&
      matchesDifficulty &&
      matchesStatus &&
      matchesSearch
    );
  });

  function openPage(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  function openAuth(mode = "login") {
    setAuthPage(mode);
    setAuthMessage("");
    setAuthError("");
    setShowAuth(true);
  }

  // Keep code submissions separate for each signed-in user and problem.
  // This uses this browser's localStorage, so no backend/schema changes are needed.
  function getSubmissionStorageKey() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?.id || user?._id || user?.email || "guest";
      return `codementor_submissions_${String(userId)}`;
    } catch {
      return "codementor_submissions_guest";
    }
  }

  function getProblemSubmissionId(problem) {
    return String(problem?.id ?? problem?._id ?? problem?.title ?? "");
  }

  // AI feedback cache exists only in memory for the current page session.
  // The exact code is part of the key, so edited code gets a fresh review.
  const aiFeedbackCacheRef = useRef({});

  function getAIFeedbackCacheKey(problem, targetLanguage = language, submittedCode = code) {
    const problemId = getProblemSubmissionId(problem);
    if (!problemId) return "";
    return `${userStorageKey}_${problemId}_${targetLanguage}_${submittedCode}`;
  }

  function readCachedAIFeedback(problem, targetLanguage = language, submittedCode = code) {
    const key = getAIFeedbackCacheKey(problem, targetLanguage, submittedCode);
    return key ? aiFeedbackCacheRef.current[key] || "" : "";
  }

  function saveCachedAIFeedback(problem, targetLanguage, feedback, submittedCode = code) {
    const key = getAIFeedbackCacheKey(problem, targetLanguage, submittedCode);
    if (key && feedback) aiFeedbackCacheRef.current[key] = feedback;
  }

  function readAllSubmissions() {
    try {
      return JSON.parse(localStorage.getItem(getSubmissionStorageKey()) || "{}");
    } catch (error) {
      console.error("Could not read saved submissions:", error);
      return {};
    }
  }
  function getAllSubmissionEntries() {
  const allSubmissions = readAllSubmissions();
  const entries = [];

  Object.entries(allSubmissions).forEach(([problemId, saved]) => {
    const history = Array.isArray(saved?.history)
      ? saved.history
      : saved?.latest
        ? [saved.latest]
        : [];

    history.forEach((item) => {
      entries.push({
        ...item,
        problemId,
        problemTitle:
          item.problemTitle ||
          saved.problemTitle ||
          `Question ${problemId}`,
        language: item.language || "java",
      });
    });
  });

  return entries.sort(
    (a, b) =>
      new Date(b.submittedAt || 0) -
      new Date(a.submittedAt || 0)
  );
}

  // Load saved submissions on first render and whenever the signed-in user changes.
  // Without this effect, the list stays empty until the user submits code again.
  useEffect(() => {
    setAllSubmissionEntries(getAllSubmissionEntries());
  }, [userStorageKey, isLoggedIn]);

  // Feedback is transient: clear it and its in-memory cache when leaving
  // Coding Practice / Code Editor. Never persist AI feedback to localStorage.
  useEffect(() => {
    if (activePage !== "Code Editor") {
      setAiFeedback("");
      aiFeedbackCacheRef.current = {};
      setIsFeedbackLoading(false);
    }
  }, [activePage]);

  // Do not display feedback for a different code version. When the selected
  // question changes, discard the previous question's temporary feedback too.
  useEffect(() => {
    setAiFeedback("");
    aiFeedbackCacheRef.current = {};
  }, [selectedProblem?.id]);

  useEffect(() => {
    setAiFeedback("");
  }, [code, language]);

  function openProblem(problem) {
    setSelectedProblem(problem);
    setOutput("");

    const problemId = getProblemSubmissionId(problem);
    const saved = readAllSubmissions()[problemId];
    const latest = saved?.latest;
    const targetLanguage = latest?.language || "java";
    setAiFeedback(readCachedAIFeedback(problem, targetLanguage, latest?.code || initialJavaCode));

    if (latest?.code) {
      setLanguage(targetLanguage);
      setCode(latest.code);
      setSubmissionStatus(
        `Loaded your last submission (${latest.language || "java"}). You can edit it and submit again.`
      );
    } else {
      setLanguage("java");
      setCode(initialJavaCode);
      setSubmissionStatus("No saved submission for this question yet.");
    }

    setSubmissionHistory(Array.isArray(saved?.history) ? saved.history : []);
    setActivePage("Code Editor");
  }

  function openEditor() {
    setOutput("");
    setAiFeedback("");
    setActivePage("Code Editor");
  }

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);

    const starterCode = {
      java: initialJavaCode,
      c: initialCCode,
      cpp: initialCppCode,
      javascript: `// JavaScript Example
      const name = "Ankit";
      console.log("Hello, " + name);`,
      python: `# Python Example
      name = "Ankit"
      print("Hello, " + name)`,
    };

    const problemId = getProblemSubmissionId(selectedProblem);
    const saved = problemId ? readAllSubmissions()[problemId] : null;
    const savedLanguageCode = saved?.byLanguage?.[nextLanguage];

    setCode(savedLanguageCode || starterCode[nextLanguage] || initialJavaCode);
    setOutput("");
    setAiFeedback("");
  }

  async function submitCode() {
    if (!selectedProblem) {
      setSubmissionStatus(
        "Open a coding question before submitting. A code run alone is not a submission."
      );
      return;
    }

    if (!code.trim()) {
      setSubmissionStatus("Write some code before submitting.");
      return;
    }

    const problemId = getProblemSubmissionId(selectedProblem);
    const testCases = selectedProblem.testCases;

    if (!problemId || !Array.isArray(testCases) || testCases.length === 0) {
      setSubmissionStatus(
        "This question has no configured test cases, so it cannot be marked as accepted."
      );
      return;
    }

    // Validate the test-case data before sending it to the backend.
    const invalidTestCase = testCases.some(
      (testCase) =>
        !testCase ||
        typeof testCase.input !== "string" ||
        typeof testCase.expectedOutput !== "string"
    );

    if (invalidTestCase) {
      setSubmissionStatus(
        "This question has an invalid test case. Please fix its input and expectedOutput in the problem data."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus("Running your code against all configured test cases...");

    try {
      const response = await axios.post(
        `${API_URL}/api/submit`,
        { code, language, testCases },
        { timeout: 90000 }
      );

      const result = response.data || {};
      const results = Array.isArray(result.results) ? result.results : [];
      const total = Number(result.total) > 0 ? Number(result.total) : testCases.length;
      const passedFromResponse = Number(result.passed);
      const passedCount = Number.isFinite(passedFromResponse)
        ? passedFromResponse
        : results.filter((item) => item?.passed === true).length;

      // Do not trust the verdict string alone. Accept only if the backend
      // returned one passing result for every configured test case.
      const allResultsPresent = results.length === testCases.length;
      const everyTestPassed =
        allResultsPresent && results.every((item) => item?.passed === true);
      const accepted =
        result.verdict === "Accepted" &&
        total === testCases.length &&
        passedCount === testCases.length &&
        everyTestPassed;

      const verdict = accepted
        ? "Accepted"
        : result.verdict === "Accepted"
          ? "Evaluation Error"
          : result.verdict || "Evaluation Error";

      const submittedAt = new Date().toISOString();
      const submission = {
        code,
        language,
        submittedAt,
        problemId,
        problemTitle: selectedProblem.title || `Question ${problemId}`,
        topic: selectedProblem.topic || "General",
        difficulty: selectedProblem.difficulty || "Easy",
        verdict,
        passed: Math.min(passedCount, testCases.length),
        total: testCases.length,
        results,
      };

      // Keep accepted and rejected attempts in history. Only a verified
      // Accepted result may count as a completed question.
      const allSubmissions = readAllSubmissions();
      const previous = allSubmissions[problemId] || {};
      const history = [
        submission,
        ...(Array.isArray(previous.history) ? previous.history : []),
      ].slice(0, 20);

      allSubmissions[problemId] = {
        problemTitle: submission.problemTitle,
        topic: submission.topic,
        difficulty: submission.difficulty,
        latest: submission,
        // Once accepted, keep the solved badge even if many later attempts are made.
        solved: accepted || previous.solved === true || (Array.isArray(previous.history) && previous.history.some((item) => item?.verdict === "Accepted")),
        byLanguage: {
          ...(previous.byLanguage || {}),
          [language]: code,
        },
        history,
      };

      localStorage.setItem(
        getSubmissionStorageKey(),
        JSON.stringify(allSubmissions)
      );
      setSubmissionHistory(history);
      setAllSubmissionEntries(getAllSubmissionEntries());

      if (accepted) {
        setSubmissionStatus(
          `Accepted! All ${testCases.length} test cases passed. Your submission was saved.`
        );

        const storedUser = localStorage.getItem("user");
        if (isLoggedIn && storedUser) {
          try {
            const token = localStorage.getItem("token");
            const progressResponse = await axios.post(
              `${API_URL}/api/progress/solve`,
              {
                problemId: String(selectedProblem.id),
                title: selectedProblem.title,
                topic: selectedProblem.topic || "General",
                difficulty: selectedProblem.difficulty || "Easy",
                language,
              },
              {
                headers: token
                  ? { Authorization: `Bearer ${token}` }
                  : {},
              }
            );

            if (progressResponse.data?.success) {
              await fetchUserProgress();
            }
          } catch (progressError) {
            console.error(
              "Accepted solution, but progress update failed:",
              progressError.response?.data || progressError.message
            );
          }
        }
      } else {
        const failedTest = results.find((item) => item?.passed !== true);
        const expected = failedTest?.expectedOutput ?? "not returned by evaluator";
        const actual = failedTest?.actualOutput ?? "not returned by evaluator";
        const details = failedTest
          ? ` Test ${failedTest.testCase || "1"}: expected "${expected}", got "${actual}".`
          : " The evaluator did not confirm that every configured test case passed.";

        setSubmissionStatus(
          `${verdict}: ${submission.passed}/${testCases.length} test cases passed.${details} Your attempt is saved, but the question is not marked complete.`
        );
      }
    } catch (error) {
      console.error(
        "Code submission evaluation failed:",
        error.response?.data || error.message
      );
      setSubmissionStatus(
        error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "Submission evaluation timed out. Please try again."
            : "Could not evaluate your submission. Check that the backend is running and /api/submit is available.")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function runCode() {
    setIsRunning(true);
    setOutput("Running your code...");

    try {
      const response = await axios.post(
        `${API_URL}/api/run`,
        {
          code,
          language,
          input: customInput,
        },
        { timeout: 30000 }
      );

      if (response.data.success) {
        setOutput(
          response.data.output || "Code executed successfully!"
        );

      } else {
        setOutput(
          response.data.output ||
            response.data.error ||
            "Something went wrong."
        );
      }
    } catch (error) {
      setOutput(
        error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "Code execution timed out. Please try again."
            : "Could not connect to the backend. Check whether the server is running.")
      );
    } finally {
      setIsRunning(false);
    }
  }


async function runAICodeAssistant() {
  if (!code.trim()) {
    setAssistantResult("Please write some code first.");
    return;
  }

  setIsAssistantLoading(true);
  setAssistantResult("AI is analyzing your code...");

  try {
    const response = await axios.post(
      `${API_URL}/api/ai-feedback`,
      {
        code,
        language,
        action: assistantAction,
        problem:
          assistantQuestion.trim() ||
          "Explain the code, identify errors, and suggest improvements.",
      },
      {
        timeout: 30000,
      }
    );

    const data = response.data || {};

    if (!response.data?.success) {
      throw new Error(
        data.message || data.error || "AI could not generate feedback."
      );
    }

    setAssistantResult(
      data.feedback ||
        data.answer ||
        "The AI returned an empty response. Please try again."
    );
  } catch (error) {
    console.error("AI Code Assistant Error:", error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error";

    setAssistantResult(`AI Error: ${message}`);
  } finally {
    setIsAssistantLoading(false);
  }
}

  // AI feedback unlocks after at least one submitted test case passes.
  async function getAIFeedback() {
    if (!selectedProblem) {
      setAiFeedback("Open a coding question first.");
      return;
    }

    if (!code.trim()) {
      setAiFeedback("Write your solution code first.");
      return;
    }

    const submittedCode = code;
    const submittedLanguage = language;
    const cachedFeedback = readCachedAIFeedback(selectedProblem, submittedLanguage, submittedCode);
    if (cachedFeedback) {
      setAiFeedback(cachedFeedback);
      return;
    }

    const saved = readAllSubmissions()[getProblemSubmissionId(selectedProblem)];
    const attempts = Array.isArray(saved?.history)
      ? saved.history
      : saved?.latest
        ? [saved.latest]
        : [];
    const hasPassedTestCase = attempts.some((attempt) =>
      Number(attempt?.passed) > 0 ||
      (Array.isArray(attempt?.results) && attempt.results.some((testResult) => testResult?.passed === true))
    );
    if (!hasPassedTestCase) {
      setAiFeedback("Run Submit Code first and pass at least one test case to unlock AI Feedback.");
      return;
    }

    setIsFeedbackLoading(true);
    setAiFeedback("AI is reviewing your code...");

    try {
      const response = await axios.post(
        `${API_URL}/api/ai-feedback`,
        {
          code: submittedCode,
          language: submittedLanguage,
          action: "review",
          problem: {
            title: selectedProblem?.title || "General code review",
            description: selectedProblem?.description || "Review this code, identify errors, and suggest improvements.",
            exampleInput: selectedProblem?.example || "",
            expectedOutput: selectedProblem?.output || "Not specified",
            inputFormat: selectedProblem?.inputFormat || "Not specified",
            actualOutput: output || "No program output captured yet. Ask the user to run the code first.",
            testCases: selectedProblem?.testCases || [],
            instruction: `Act as a strict coding interview mentor. Do NOT give only praise or a generic review. The user specifically needs to know whether their solution can be improved and what the best alternative is.

Return your answer in these exact Markdown sections:
## 1. Verdict on My Solution
Briefly explain correctness and any issues. Do not claim it passed all tests unless the supplied test results prove that.
## 2. Complexity of My Code
State time and auxiliary space complexity using plain text such as O(n), O(n log n), O(n^2). Explain why each complexity applies. Do not output LaTeX math delimiters or raw math markup.
## 3. Can It Be Optimized?
Compare the current approach with a better approach. If a more efficient standard approach exists, clearly say so and explain the key idea. If it is already optimal, explain why and do not pretend there is a faster solution.
## 4. One Final Recommended Solution
Give exactly ONE complete, compilable solution in the same language (${language}) that you recommend as the best practical solution for this problem. Do not list multiple alternatives, do not provide several code versions, and do not ask the user to request another solution. Prefer the best known algorithm for the stated constraints and target optimal asymptotic time/space complexity where possible. Include imports, input parsing and output formatting matching the problem's actual format. If the submitted approach is already asymptotically optimal, say so clearly and provide one clean final implementation only if it meaningfully improves clarity or robustness.
## 5. Complexity Comparison
State time and auxiliary space complexity for the user's code and the one recommended solution. Compare them in a small Markdown table with columns Approach, Time, Space, Trade-off. Be precise; do not claim an improvement if the complexities are the same.
## 6. Why This Is the Recommended Solution
Explain the key idea in beginner-friendly steps and mention edge cases. Explain why this is the single solution you recommend, not merely one of many options.
## 7. Test / Output Check
Compare actual output with expected output only when actual output and a verified expected output are available. Explicitly note missing data. Never invent execution results or claim all test cases passed based on a sample alone.

Problem: ${selectedProblem?.title || "General code review"}. Use the supplied problem statement, constraints, input format, sample and test cases as the source of truth. If details are incomplete, state assumptions. Return one final recommendation only; never generate a second/third alternative in the same answer.`,
          },
        },
        { timeout: 60000 }
      );

      const data = response.data || {};

      if (!data.success) {
        throw new Error(
          data.message || data.error || "AI could not generate feedback."
        );
      }

      const aiText = data.feedback || data.answer || "The AI returned an empty response. Please try again.";
      const expected = selectedProblem?.testCases?.[0]?.expectedOutput;
      const actual = String(output || "").replace(/\r\n/g, "\n").trim();
      const expectedNormalized = expected == null ? "" : String(expected).replace(/\r\n/g, "\n").trim();
      const hasActualOutput = actual && !/^(your program output will appear here\.?|running your code\.\.\.)$/i.test(actual);
      const outputCheck = selectedProblem && expectedNormalized && hasActualOutput
        ? `### Output check (based on your last run)\n- **Expected output:** \`${expectedNormalized}\`\n- **Actual output:** \`${actual}\`\n- **Result:** ${actual === expectedNormalized ? "The displayed output matches the first sample test." : "Output mismatch. Do not submit as accepted until the program prints the required output."}\n\n---\n\n`
        : "";
      const finalFeedback = outputCheck + aiText;
      setAiFeedback(finalFeedback);
      saveCachedAIFeedback(selectedProblem, submittedLanguage, finalFeedback, submittedCode);
    } catch (error) {
      console.error("AI feedback error:", error);
      setAiFeedback(
        `AI Error: ${
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unable to generate feedback."
        }`
      );
    } finally {
      setIsFeedbackLoading(false);
    }
  }

  function addCustomRoadmap(event) {
    event.preventDefault();

    const topic = customRoadmapTopic.trim();

    if (!topic) return;

    const newRoadmap = {
      id: Date.now(),
      topic,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setCustomRoadmaps((previous) => [
      newRoadmap,
      ...previous,
    ]);

    setCustomRoadmapTopic("");
  }

  function toggleModuleCompletion(moduleTitle) {
    // Module completion is calculated automatically from lessons, quiz and accepted practice.
    const module = roadmapModules.find((item) => item.title === moduleTitle);
    return module ? getRoadmapModuleStatus(module).complete : false;
  }

  const getRoadmapModuleStatus = (module) => {
    const saved = roadmapLearningState[module.title] || {};
    const completedLessons = saved.lessons || {};
    const lessonsDone = (module.lessons || []).filter((_, i) => completedLessons[i]).length;
    const quizPassed = saved.quizPassed === true;
    const acceptedCount = (module.relatedTopics || []).length
      ? Object.entries(savedProblemSubmissions).filter(([problemId, record]) => {
          if (!(record?.solved === true || (Array.isArray(record?.history) && record.history.some((item) => item?.verdict === "Accepted")) || record?.latest?.verdict === "Accepted")) return false;
          const problem = problems.find((item) => String(item.id) === String(problemId));
          const topic = String(problem?.topic || record?.topic || "").toLowerCase();
          return (module.relatedTopics || []).some((candidate) => topic.includes(String(candidate).toLowerCase()));
        }).length
      : 0;
    const lessonsPassed = lessonsDone === (module.lessons || []).length;
    const practicePassed = acceptedCount >= 3;
    const complete = lessonsPassed && quizPassed && practicePassed;
    const lessonPercent = (module.lessons || []).length ? Math.round((lessonsDone / module.lessons.length) * 100) : 0;
    const progress = Math.round((lessonPercent + (quizPassed ? 100 : 0) + Math.min(100, Math.round((acceptedCount / 3) * 100))) / 3);
    return { lessonsDone, lessonTotal: (module.lessons || []).length, quizPassed, acceptedCount, practicePassed, complete, progress };
  };

  function updateRoadmapLearning(moduleTitle, updater) {
    setRoadmapLearningState((previous) => {
      const current = previous[moduleTitle] || { lessons: {}, answers: {}, quizPassed: false };
      return { ...previous, [moduleTitle]: updater(current) };
    });
  }

  // Coding Practice topic progress: counts accepted questions against every question in that topic.
  const topicProgressData = (() => {
    const grouped = new Map();
    problems.forEach((problem) => {
      const topic = String(problem.topic || "Other").trim() || "Other";
      const key = topic.toLowerCase();
      if (!grouped.has(key)) grouped.set(key, { topic, total: 0, solved: 0 });
      const item = grouped.get(key);
      item.total += 1;
      if (getProblemStatus(problem) === "solved") item.solved += 1;
    });
    return Array.from(grouped.values())
      .map((item) => ({ ...item, percent: item.total ? Math.round((item.solved / item.total) * 100) : 0 }))
      .sort((a, b) => a.topic.localeCompare(b.topic));
  })();
  const totalTopicQuestions = topicProgressData.reduce((sum, item) => sum + item.total, 0);
  const solvedTopicQuestions = topicProgressData.reduce((sum, item) => sum + item.solved, 0);
  const overallTopicPercent = totalTopicQuestions ? Math.round((solvedTopicQuestions / totalTopicQuestions) * 100) : 0;

  const navItems = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Beginner Zone", icon: "◈" },
  { label: "Coding Practice", icon: "⌘" },
  { label: "AI Mentor", icon: "✧" },
  { label: "AI Assistant", icon: "🤖" },
  { label: "Learning Roadmap", icon: "↗" },
];
  const moduleStatuses = roadmapModules.map((module) => getRoadmapModuleStatus(module));
  const completedCount = moduleStatuses.filter((status) => status.complete).length;
  const automaticCompletedTitles = roadmapModules
    .filter((module, index) => moduleStatuses[index].complete)
    .map((module) => module.title);

  useEffect(() => {
    setCompletedModules((previous) => {
      const next = automaticCompletedTitles;
      if (previous.length === next.length && previous.every((title, index) => title === next[index])) return previous;
      return next;
    });
  }, [automaticCompletedTitles.join("|")]);

  // Roadmap progress is derived from lesson completion, quiz result and accepted practice.
  const averageRoadmapProgress = roadmapModules.length
    ? Math.round(moduleStatuses.reduce((sum, status) => sum + status.progress, 0) / roadmapModules.length)
    : 0;

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  // Landing page and authentication are shown before the dashboard.
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <button
            onClick={() => setShowAuth(false)}
            className="flex items-center gap-3"
          >
            <span aria-label="Learn Code logo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-sm font-black tracking-tight text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              &lt;/&gt;
            </span>

            <span className="text-xl font-bold tracking-tight">
              Learn Code
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth("login")}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Login
            </button>

            <button
              onClick={() => openAuth("signup")}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Get Started
            </button>
          </div>
        </header>

        <main className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-2 md:pb-28 md:pt-20">
          <section>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-200">
              <span>✦</span>
              Your personal AI coding companion
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn to code.
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                Build your future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Practice programming, solve coding challenges,
              follow a learning roadmap and improve your code
              with AI-powered feedback.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => openAuth("signup")}
                className="rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                Start Learning Free →
              </button>

              <button
                onClick={() => openAuth("login")}
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                I have an account
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>✓ Hands-on coding</span>
              <span>✓ AI feedback</span>
              <span>✓ Personalized learning</span>
            </div>
          </section>

          <section className="relative mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold">
                    Your Coding Workspace
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Practice · Learn · Improve
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  Ready to learn
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5 font-mono text-sm leading-7">
                <p className="text-slate-500">
                  // Your first Java program
                </p>
                <p>
                  <span className="text-fuchsia-300">class</span>{" "}
                  <span className="text-cyan-300">Main</span>{" "}
                  {"{"}
                </p>
                <p className="pl-5">
                  <span className="text-fuchsia-300">public static void</span>{" "}
                  <span className="text-amber-200">main</span>() {"{"}
                </p>
                <p className="pl-10">
                  System.out.println(
                  <span className="text-emerald-300">
                    "Hello, Developer!"
                  </span>
                  );
                </p>
                <p className="pl-5">{"}"}</p>
                <p>{"}"}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-indigo-400/10 p-4">
                  <p className="text-xs text-indigo-200">
                    Practice
                  </p>
                  <p className="mt-2 text-lg font-bold">
                    Coding Challenges
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-400/10 p-4">
                  <p className="text-xs text-cyan-200">
                    Improve
                  </p>
                  <p className="mt-2 text-lg font-bold">
                    AI Feedback
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 shadow-xl sm:block">
              <p className="text-sm font-semibold">
                Keep learning 🚀
              </p>
              <p className="mt-1 text-xs text-slate-400">
                One problem at a time
              </p>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/10 px-5 py-6 text-center text-sm text-slate-500">
          Learn Code · Learn by building.
        </footer>

        {showAuth && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setShowAuth(false);
              }
            }}
          >
            <div className="my-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                    C
                  </div>

                  <h2 className="text-2xl font-bold">
                    {authPage === "signup"
                      ? "Create your account"
                      : authPage === "forgot"
                        ? "Forgot password?"
                        : "Welcome back"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {authPage === "signup"
                      ? "Start your coding journey today."
                      : authPage === "forgot"
                        ? "Enter your email and we’ll send reset instructions."
                        : "Log in to continue learning."}
                  </p>
                </div>

                <button
                  onClick={() => setShowAuth(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close authentication dialog"
                >
                  ✕
                </button>
              </div>

              {authPage !== "forgot" && (
              <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => {
                    setAuthPage("login");
                    setForgotStep(1);
                    setForgotOtp("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setAuthMessage("");
                    setAuthError("");
                  }}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                    authPage === "login"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setAuthPage("signup");
                    setAuthMessage("");
                    setAuthError("");
                  }}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                    authPage === "signup"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {authPage === "signup" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full name
                    </label>

                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Enter your full name"
                      value={authName}
                      onChange={(event) =>
                        setAuthName(event.target.value)
                      }
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Registered email address
                  </label>

                  <input
                    type="email"
                    className={inputClass}
                    placeholder="you@example.com"
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                    readOnly={authPage === "forgot" && forgotStep > 1}
                    required
                  />
                </div>

                {authPage === "forgot" && forgotStep === 2 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      className={inputClass}
                      placeholder="Enter 6-digit OTP"
                      value={forgotOtp}
                      onChange={(event) => setForgotOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                    />
                    <p className="mt-2 text-xs text-slate-500">Check your registered email inbox and spam folder.</p>
                  </div>
                )}

                {authPage === "forgot" && forgotStep === 3 && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium">New password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        className={inputClass}
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Confirm new password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        className={inputClass}
                        placeholder="Re-enter new password"
                        value={confirmNewPassword}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                  </>
                )}

                {authPage !== "forgot" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Password
                    </label>

                    <input
                      type="password"
                      className={inputClass}
                      placeholder="At least 8 characters"
                      value={authPassword}
                      onChange={(event) =>
                        setAuthPassword(event.target.value)
                      }
                      minLength={8}
                      required
                    />
                    {authPage === "login" && (
                      <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthPage("forgot");
                            setForgotStep(1);
                            setForgotOtp("");
                            setNewPassword("");
                            setConfirmNewPassword("");
                            setAuthMessage("");
                            setAuthError("");
                            setAuthPassword("");
                          }}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {authError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {authError}
                  </div>
                )}

                {authMessage && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    {authMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`${primaryButton} w-full py-3.5`}
                >
                  {authLoading
                    ? "Please wait..."
                    : authPage === "signup"
                      ? "Create Account →"
                      : authPage === "forgot"
                        ? forgotStep === 1
                          ? "Send OTP to Email →"
                          : forgotStep === 2
                            ? "Verify OTP →"
                            : "Reset Password →"
                        : "Login →"}
                </button>
              </form>

              {authPage === "forgot" ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthPage("login");
                    setForgotStep(1);
                    setForgotOtp("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setAuthMessage("");
                    setAuthError("");
                  }}
                  className="mt-5 w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  ← Back to Login
                </button>
              ) : (
                <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                  By continuing, you agree to use Learn Code
                  responsibly for your learning.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }


  const filteredSubmissionEntries = allSubmissionEntries.filter((item) => {
    const verdict = String(item.verdict || item.status || "").trim().toLowerCase();
    const isAccepted = item.accepted === true || verdict === "accepted" || verdict === "passed";
    const isNotEvaluated = !verdict || verdict === "not evaluated" || verdict === "saved";
    const matchesStatus =
      submissionFilter === "All" ||
      (submissionFilter === "Accepted" && isAccepted) ||
      (submissionFilter === "Failed" && !isAccepted && !isNotEvaluated) ||
      (submissionFilter === "Not evaluated" && isNotEvaluated);
    const matchesLanguage =
      submissionLanguageFilter === "All" ||
      String(item.language || "java").toLowerCase() === submissionLanguageFilter.toLowerCase();
    const query = submissionSearch.trim().toLowerCase();
    const matchesSearch = !query ||
      String(item.problemTitle || `Question ${item.problemId}`).toLowerCase().includes(query);
    return matchesStatus && matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white py-5 shadow-sm transition-all duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 w-72 px-5" : "-translate-x-full w-20 px-3"
        } ${sidebarHovered ? "md:w-72 md:px-5 md:shadow-xl" : "md:w-20 md:px-3"}`}
      >
        <button
          onClick={() => openPage("Dashboard")}
          title="Learn Code — Dashboard"
          className={`mb-9 flex min-h-11 items-center gap-3 text-left ${sidebarHovered || sidebarOpen ? "justify-start" : "justify-center"}`}
        >
          <span aria-label="Learn Code logo" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-sm font-black tracking-tight text-white shadow-lg shadow-indigo-600/20 ring-1 ring-white/20">
            &lt;/&gt;
          </span>
          <span className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarHovered || sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            <span className="block text-lg font-bold tracking-tight">Learn Code</span>
            <span className="block text-xs text-slate-500">Learn. Practice. Grow.</span>
          </span>
        </button>

        <p className={`mb-3 overflow-hidden whitespace-nowrap px-3 text-xs font-bold uppercase tracking-widest text-slate-400 transition-opacity ${sidebarHovered || sidebarOpen ? "opacity-100" : "opacity-0"}`}>
          Main Menu
        </p>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activePage === item.label;
            const expanded = sidebarHovered || sidebarOpen;
            return (
              <button
                key={item.label}
                title={!expanded ? item.label : undefined}
                onClick={() => openPage(item.label)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${expanded ? "justify-start" : "justify-center"} ${
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon><span className="text-xl">{item.icon}</span></Icon>
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${expanded ? "w-auto flex-1 opacity-100" : "w-0 flex-none opacity-0"}`}>{item.label}</span>
                {isActive && expanded && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </nav>

        <div className={`mt-6 mb-4 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/15 transition-all duration-200 ${sidebarHovered || sidebarOpen ? "p-4" : "p-2"}`}>
          {sidebarHovered || sidebarOpen ? (
            <>
              <p className="text-sm font-bold leading-5">Keep going! 🚀</p>
              <p className="mt-2 text-xs leading-5 text-indigo-100">Every problem you solve makes you a better developer.</p>
              <button onClick={() => openPage("Coding Practice")} className="mt-4 flex min-h-10 w-full items-center justify-center whitespace-nowrap rounded-xl bg-white px-3 py-2.5 text-sm font-bold !text-indigo-700 transition hover:bg-indigo-50">Practice Now</button>
            </>
          ) : (
            <button onClick={() => openPage("Coding Practice")} title="Practice Now" className="flex h-10 w-full items-center justify-center text-lg">🚀</button>
          )}
        </div>
      </aside>
      <div className={`min-h-screen transition-[padding] duration-300 ease-in-out ${sidebarHovered ? "md:pl-72" : "md:pl-20"}`}>
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 md:hidden"
              aria-label="Open navigation"
            >
              ☰
            </button>

            <div>
              <h1 className="text-lg font-bold sm:text-xl">
                {activePage}
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Welcome back, {userName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              title="Total coins earned from Daily Challenges"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-2"
              aria-label={`${dailyCoins} coins earned`}
            >
              <span className="text-lg" aria-hidden="true">🪙</span>
              <span className="text-sm font-extrabold text-amber-800">
                {dailyCoins}
              </span>
            </div>

            <div
              title="Current daily challenge streak"
              className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-2"
              aria-label={`${dailyStreak} day streak`}
            >
              <span className="text-lg" aria-hidden="true">🔥</span>
              <span className="text-sm font-extrabold text-orange-800">
                {dailyStreak}
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((open) => !open)}
                aria-label="Open user menu"
                aria-expanded={showUserMenu}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ring-2 ring-transparent transition hover:ring-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {savedUser?.email || "Student account"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <span aria-hidden="true">👤</span> Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      setActivePage("My Progress");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <span aria-hidden="true">▥</span> My Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <span aria-hidden="true">↪</span> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {showProfileModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Account</p>
                  <h2 id="profile-modal-title" className="mt-1 text-2xl font-bold text-slate-900">Your Profile</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  aria-label="Close profile"
                  className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-xl bg-indigo-50 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{userName}</p>
                  <p className="truncate text-sm text-slate-600">{savedUser?.email || "Email not available"}</p>
                  <p className="mt-1 text-xs text-indigo-700">Learn Code Student</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs text-amber-700">Total coins</p>
                  <p className="mt-1 text-xl font-extrabold text-amber-800">🪙 {dailyCoins}</p>
                </div>
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                  <p className="text-xs text-orange-700">Current streak</p>
                  <p className="mt-1 text-xl font-extrabold text-orange-800">🔥 {dailyStreak}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Log out
                </button>
              </div>
            </section>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {activePage === "Dashboard" && (
            <div className="space-y-5 sm:space-y-6">
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-600/10 sm:p-9 lg:p-10">
                <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10 max-w-3xl">
                  <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-wide !text-white">
                    YOUR PERSONAL CODING ASSISTANT
                  </span>

                  <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                    Build skills. Solve problems.
                    <br />Become a developer.
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                    Practice coding, follow your roadmap and use
                    AI feedback to improve your problem-solving
                    skills one step at a time.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => openPage("Coding Practice")}
                      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-extrabold !text-indigo-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50"
                    >
                      Start Practicing →
                    </button>

                    <button
                      onClick={() => openPage("Learning Roadmap")}
                      className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold !text-white transition hover:bg-white/20"
                    >
                      View Roadmap
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 right-8 hidden text-[150px] font-black leading-none text-white/10 lg:block">
                  {"</>"}
                </div>
              </section>

              <button
                type="button"
                onClick={() => openPage("Daily Challenge")}
                className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg sm:p-6"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-inner">🔥</span>
                  <span>
                    <span className="block text-xl font-extrabold text-slate-900 sm:text-2xl">Daily Challenge</span>
                    <span className="mt-1 block text-base leading-6 text-slate-600">Solve today's coding problem and keep your streak alive.</span>
                  </span>
                </span>
                <span className="shrink-0 rounded-xl bg-orange-500 px-5 py-3 text-base font-bold !text-white transition group-hover:bg-orange-600">Open →</span>
              </button>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Problems Solved",
                    // Use the same local accepted-submission records as the Coding Practice checkmarks.
                    value: solvedProblemCount,
                    icon: "⌘",
                    color: "bg-indigo-50 text-indigo-700",
                    note: "Your recorded progress",
                  },
                  {
                    label: "Roadmap Progress",
                    value: `${averageRoadmapProgress}%`,
                    icon: "↗",
                    color: "bg-cyan-50 text-cyan-700",
                    note: "Across learning modules",
                  },
                  {
                    label: "Modules Completed",
                    value: completedCount,
                    icon: "✓",
                    color: "bg-emerald-50 text-emerald-700",
                    note: "Keep the momentum going",
                  },
                  {
                    label: "Current Level",
                    value: "Beginner",
                    icon: "✦",
                    color: "bg-amber-50 text-amber-700",
                    note: "Build strong foundations",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${cardClass} min-w-0 p-5 sm:p-6`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-slate-600">
                        {item.label}
                      </span>

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${item.color}`}
                      >
                        {item.icon}
                      </span>
                    </div>

                    <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">
                      {item.value}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {item.note}
                    </p>
                  </div>
                ))}
              </section>

              <section className="grid items-start gap-5 2xl:grid-cols-3">
                <div className={`${cardClass} min-w-0 xl:col-span-2`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">
                        Continue Learning
                      </h3>

                      <p className="mt-1 text-base text-slate-500">
                        Pick up where you left off.
                      </p>
                    </div>

                    <button
                      onClick={() => openPage("Learning Roadmap")}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {roadmapModules.slice(0, 3).map((module) => {
                      const progress = getRoadmapModuleStatus(module).progress;

                      return (
                        <div key={module.title}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold">
                                {module.title}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {module.description}
                              </p>
                            </div>

                            <span className="text-sm font-bold text-indigo-600">
                              {progress}%
                            </span>
                          </div>

                          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`${cardClass} flex min-w-0 flex-col`}>
                  <h3 className="text-lg font-bold">
                    Quick Actions
                  </h3>

                  <p className="mt-1 text-base text-slate-500">
                    What would you like to do today?
                  </p>

                  <div className="mt-5 space-y-3">
                    {[
                      {
                        title: "Solve a Problem",
                        description: "Practice DSA questions",
                        icon: "⌘",
                        page: "Coding Practice",
                      },
                      {
                        title: "Ask AI Mentor",
                        description: "Get feedback on your code",
                        icon: "✧",
                        page: "AI Mentor",
                      },
                      {
                        title: "Beginner Zone",
                        description: "Learn the fundamentals",
                        icon: "◈",
                        page: "Beginner Zone",
                      },
                    ].map((action) => (
                      <button
                        key={action.title}
                        onClick={() => openPage(action.page)}
                        className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                          {action.icon}
                        </span>

                        <span>
                          <span className="block text-base font-semibold">
                            {action.title}
                          </span>

                          <span className="mt-1 block text-sm text-slate-500">
                            {action.description}
                          </span>
                        </span>

                        <span className="ml-auto text-slate-400">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>


            </div>
          )}

          {activePage === "Daily Challenge" && (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Daily Challenge 🔥</h2>
                  <p className="mt-2 text-sm text-slate-500">Solve one problem every day and build your coding streak.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openPage("Dashboard")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <DailyChallenge />
            </section>
          )}

          {activePage === "Coding Practice" && (
            <section className="space-y-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-6 text-white sm:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100">LEARN CODE · PROBLEMSET</span>
                      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Coding Practice</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Practice DSA problems, track your progress, and build interview-ready problem-solving skills.</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur">
                      <div className="text-2xl font-bold">{solvedProblemCount}<span className="text-base font-medium text-slate-300">/{problems.length}</span></div>
                      <div className="mt-1 text-xs text-slate-300">problems solved</div>
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${problems.length ? Math.min(100, (solvedProblemCount / problems.length) * 100) : 0}%` }} /></div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-b border-slate-200 sm:grid-cols-4 sm:divide-y-0">
                  <div className="px-5 py-4"><div className="text-xs text-slate-500">Total problems</div><div className="mt-1 text-xl font-bold text-slate-900">{problems.length}</div></div>
                  <div className="px-5 py-4"><div className="text-xs text-slate-500">Easy solved</div><div className="mt-1 text-xl font-bold text-emerald-600">{problems.filter((p) => p.difficulty === "Easy" && getProblemStatus(p) === "solved").length}</div></div>
                  <div className="px-5 py-4"><div className="text-xs text-slate-500">Medium solved</div><div className="mt-1 text-xl font-bold text-amber-600">{problems.filter((p) => p.difficulty === "Medium" && getProblemStatus(p) === "solved").length}</div></div>
                  <div className="px-5 py-4"><div className="text-xs text-slate-500">Hard solved</div><div className="mt-1 text-xl font-bold text-rose-600">{problems.filter((p) => p.difficulty === "Hard" && getProblemStatus(p) === "solved").length}</div></div>
                </div>
                <div className="grid gap-3 border-b border-slate-200 p-5 md:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(150px,1fr)]">
                  <label className="relative block"><span className="sr-only">Search problems</span><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title, number, or keyword..." className={`${inputClass} pl-9`} /></label>
                  <select aria-label="Filter by topic" value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} className={inputClass}><option value="All">All Topics</option>{[...new Set(problems.map((problem) => problem.topic))].sort().map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select>
                  <select aria-label="Filter by difficulty" value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value)} className={inputClass}><option value="All">All Difficulties</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
                </div>
              </div>


              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[54px_minmax(0,1fr)_100px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid-cols-[64px_minmax(0,1fr)_140px_110px] sm:px-5"><span>Status</span><span>Title</span><span className="hidden sm:block">Topic</span><span>Difficulty</span></div>
                {filteredProblems.map((problem) => {
                  const solved = getProblemStatus(problem) === "solved";
                  return <button key={problem.id} type="button" onClick={() => openProblem(problem)} className="grid w-full grid-cols-[54px_minmax(0,1fr)_100px] items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-indigo-50/60 last:border-b-0 sm:grid-cols-[64px_minmax(0,1fr)_140px_110px] sm:px-5">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${solved ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`} title={solved ? "Solved" : "Not solved"}>{solved ? "✓" : "○"}</span>
                    <span className="min-w-0"><span className="flex min-w-0 items-center gap-2"><span className="shrink-0 font-mono text-xs text-slate-400">{problem.id}.</span><span className="truncate font-semibold text-slate-900">{problem.title}</span></span><span className="mt-1 block truncate text-xs text-slate-500">{problem.description}</span></span>
                    <span className="hidden text-sm text-slate-500 sm:block">{problem.topic}</span>
                    <span className={`justify-self-start rounded-md px-2.5 py-1 text-xs font-semibold ${problem.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700" : problem.difficulty === "Medium" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{problem.difficulty}</span>
                  </button>;
                })}
                {filteredProblems.length === 0 && <div className="px-5 py-12 text-center"><div className="text-3xl">⌕</div><p className="mt-2 font-semibold text-slate-800">No problems found</p><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p><button type="button" onClick={() => { setSearchTerm(""); setSelectedTopic("All"); setSelectedDifficulty("All"); setProblemStatusFilter("All"); }} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Clear filters</button></div>}
              </div>
              <p className="text-xs text-slate-500">Showing {filteredProblems.length} of {problems.length} problems. Progress is updated from your accepted submissions.</p>
            </section>
          )}

          {activePage === "Problem Details" && (
            <section className="space-y-6">
              <button
                onClick={() => openPage("Coding Practice")}
                className={secondaryButton}
              >
                ← Back to Problems
              </button>

              {selectedProblem ? (
                <div className={`${cardClass} w-full max-w-6xl`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {selectedProblem.topic}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {selectedProblem.difficulty}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    {selectedProblem.title}
                  </h2>

                  <h3 className="mt-7 font-bold">
                    Problem Description
                  </h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {selectedProblem.description}
                  </p>

                  <h3 className="mt-6 font-bold">
                    Example Input
                  </h3>

                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-emerald-300">
                    {selectedProblem.example}
                  </pre>

                  <h3 className="mt-6 font-bold">
                    Expected Output
                  </h3>

                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-emerald-300">
                    {selectedProblem.output}
                  </pre>

                  <button
                    onClick={openEditor}
                    className={`${primaryButton} mt-7`}
                  >
                    Open Code Editor →
                  </button>
                </div>
              ) : (
                <div className={cardClass}>
                  <p className="text-sm text-slate-500">
                    Select a problem from Coding Practice first.
                  </p>

                  <button
                    onClick={() => openPage("Coding Practice")}
                    className={`${primaryButton} mt-3`}
                  >
                    Browse Problems
                  </button>
                </div>
              )}
            </section>
          )}

          {activePage === "Code Editor" && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedProblem?.title || "Code Editor"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Write, run and improve your solution.
                  </p>
                </div>

                <button
                  onClick={() => openPage("Coding Practice")}
                  className={secondaryButton}
                >
                  ← Back
                </button>
              </div>

              <div className="grid min-w-0 gap-4 xl:grid-cols-2 xl:items-start">
                {/* LeetCode-inspired light problem statement panel */}
                <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-indigo-700">{selectedProblem?.topic || "Practice"}</span>
                      <span className={`rounded-full px-2.5 py-1 ${selectedProblem?.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700" : selectedProblem?.difficulty === "Hard" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{selectedProblem?.difficulty || "Select a problem"}</span>
                      {selectedProblem && getProblemStatus(selectedProblem) === "solved" && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">✓ Solved</span>}
                    </div>
                    <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{selectedProblem?.title || "Choose a problem"}</h2>
                    <p className="mt-1 text-xs text-slate-500">Problem {selectedProblem?.id || "—"} · Learn Code Practice</p>
                  </div>

                  {selectedProblem ? (
                    <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 text-sm leading-7 text-slate-700">
                      {(() => {
                        const needsGuide = selectedProblem.inputFormat === "__NEEDS_LEARNING_GUIDE__" || selectedProblem.description.startsWith("Practice ");
                        const guide = getProblemLearningGuide(selectedProblem);
                        return (
                          <>
                            <section>
                              <h3 className="mb-2 text-base font-bold text-slate-900">Problem Description — Easy Explanation</h3>
                              <p className="whitespace-pre-line">{needsGuide ? guide.summary : selectedProblem.description}</p>
                            </section>
                            <section className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-4">
                              <h3 className="mb-2 text-base font-bold text-slate-900">What do you need to do?</h3>
                              <p>{needsGuide ? guide.goal : "Read the input carefully and return the result requested in the problem statement."}</p>
                            </section>
                            <section>
                              <h3 className="mb-2 text-base font-bold text-slate-900">How to think about it</h3>
                              <p>{guide.approach}</p>
                            </section>
                            <section>
                              <h3 className="mb-2 text-base font-bold text-slate-900">Edge cases to consider</h3>
                              <p>{guide.edgeCases}</p>
                            </section>
                            {selectedProblem.inputFormat && !needsGuide && (
                              <section>
                                <h3 className="mb-2 text-base font-bold text-slate-900">Input Format</h3>
                                <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 text-slate-700">{selectedProblem.inputFormat}</div>
                              </section>
                            )}
                            {needsGuide && (
                              <section className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                                <strong>Note:</strong> This catalog item did not include a verified sample input/output or exact input format in the source data. The guide above explains the goal and approach, but add a confirmed example and test cases before enabling automatic judging for this problem.
                              </section>
                            )}
                          </>
                        );
                      })()}

                      {!((selectedProblem.inputFormat === "__NEEDS_LEARNING_GUIDE__") || selectedProblem.description.startsWith("Practice ")) && <section>
                        <h3 className="mb-2 text-base font-bold text-slate-900">Example</h3>
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">Input</div>
                          <pre className="whitespace-pre-wrap break-words bg-white p-3 font-mono text-sm text-slate-800">{selectedProblem.example || "No example provided."}</pre>
                          <div className="border-y border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">Expected Output</div>
                          <pre className="whitespace-pre-wrap break-words bg-white p-3 font-mono text-sm text-slate-800">{selectedProblem.output || "No expected output provided."}</pre>
                        </div>
                      </section>}

                      {selectedProblem.testCases?.length > 0 && (
                        <section>
                          <h3 className="mb-2 text-base font-bold text-slate-900">Practice Test Cases</h3>
                          <div className="space-y-3">
                            {selectedProblem.testCases.slice(0, 3).map((testCase, index) => (
                              <div key={`${selectedProblem.id}-statement-test-${index}`} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Example {index + 1}</p>
                                <p className="mb-1 text-xs font-semibold text-slate-600">Input</p>
                                <pre className="whitespace-pre-wrap break-words rounded-md bg-white p-2 font-mono text-xs text-slate-800">{testCase.input || "(empty input)"}</pre>
                                <p className="mb-1 mt-2 text-xs font-semibold text-slate-600">Output</p>
                                <pre className="whitespace-pre-wrap break-words rounded-md bg-white p-2 font-mono text-xs text-slate-800">{testCase.expectedOutput ?? "Not provided"}</pre>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                      <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">Tip: match the required output format exactly. Use Run Code to test your solution before submitting.</div>
                    </div>
                  ) : (
                    <div className="p-5 text-sm text-slate-500">Select a problem from Coding Practice to see its description and examples here.</div>
                  )}
                </article>

                {/* Editor panel stays light around the dark code editor */}
                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <h3 className="font-bold text-slate-900">Code Workspace</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Write your solution, then run or submit it.</p>
                    </div>
                    <select
                      value={language}
                      onChange={(event) => handleLanguageChange(event.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      aria-label="Programming language"
                    >
                      <option value="java">Java</option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                  </div>
                  <Editor
                    height="min(70vh, 650px)"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value ?? "")}
                    onMount={handleEditorMount}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      padding: { top: 16 },
                    }}
                  />
                  <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3">
                    <span className="text-xs text-slate-500">{language.toUpperCase()} · Use Run Code or Submit Code below.</span>
                    <span className="text-xs font-medium text-emerald-700">● Ready to practice</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <div className={cardClass}>
                  <h3 className="font-bold">Custom Input</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Provide input for your program, if needed.
                  </p>

                  <textarea
                    rows={5}
                    value={customInput}
                    onChange={(event) =>
                      setCustomInput(event.target.value)
                    }
                    placeholder="Enter program input here..."
                    className={`${inputClass} mt-4 resize-y font-mono`}
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className={primaryButton}
                    >
                      {isRunning
                        ? "Running..."
                        : "▶ Run Code"}
                    </button>

                    <button
                      onClick={submitCode}
                      disabled={isSubmitting || isRunning}
                      className={secondaryButton}
                    >
                      {isSubmitting ? "Checking test cases..." : "⬆ Submit Code"}
                    </button>

                    <button
                      onClick={getAIFeedback}
                      disabled={!selectedProblem || !code.trim() || !selectedProblemHasPassedTestCase || isFeedbackLoading}
                      title={!selectedProblemHasPassedTestCase ? "Submit your code and pass at least one test case to unlock AI Feedback." : !code.trim() ? "Write your code first." : "Review this exact code. Repeated requests reuse the current-session result."}
                      className={`${secondaryButton} ${(!selectedProblem || !code.trim() || !selectedProblemHasPassedTestCase || isFeedbackLoading) ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {isFeedbackLoading
                        ? "Analyzing..."
                        : selectedProblemHasPassedTestCase
                          ? "✧ Get AI Feedback"
                          : "🔒 Pass 1 Test Case to Unlock"}
                    </button>
                  </div>
                  {!selectedProblemHasPassedTestCase && (
                    <p className="mt-2 text-xs text-slate-500">
                      AI Feedback unlocks after you submit code and pass at least one test case.
                    </p>
                  )}

                  {submissionStatus && (
                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800" role="status">
                      {submissionStatus}
                    </div>
                  )}

                  {/* Show detailed results for the latest submission so the learner can identify the failing test case. */}
                  {submissionHistory[0]?.results?.length > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-800">Test Case Details</h3>
                        <span className="text-xs text-slate-500">
                          Latest {submissionHistory[0].verdict || "submission"}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {submissionHistory[0].results.map((test, index) => {
                          const testInput = selectedProblem?.testCases?.[index]?.input ?? "Not provided by evaluator";
                          const expected = String(test?.expectedOutput ?? "(not returned)");
                          const actual = String(test?.actualOutput ?? "(not returned)");
                          const passed = test?.passed === true;
                          const hasExtraText = !passed && expected.length > 0 && actual.includes(expected);

                          return (
                            <div
                              key={`${submissionHistory[0].submittedAt || "latest"}-test-${test?.testCase || index + 1}`}
                              className={`rounded-lg border p-3 ${passed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-semibold text-slate-800">
                                  Test Case {test?.testCase || index + 1}
                                </h4>
                                <span className={`rounded-full px-2 py-1 text-xs font-bold ${passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                  {passed ? "PASSED" : test?.status || "FAILED"}
                                </span>
                              </div>
                              <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <div>
                                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Input</p>
                                  <pre className="whitespace-pre-wrap break-words rounded-md bg-white p-2 font-mono text-xs text-slate-800">{testInput || "(empty input)"}</pre>
                                </div>
                                <div>
                                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Expected output</p>
                                  <pre className="whitespace-pre-wrap break-words rounded-md bg-white p-2 font-mono text-xs text-slate-800">{expected}</pre>
                                  <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Your output</p>
                                  <pre className="whitespace-pre-wrap break-words rounded-md bg-white p-2 font-mono text-xs text-slate-800">{actual}</pre>
                                </div>
                              </div>
                              {!passed && (
                                <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900">
                                  <strong>What to fix: </strong>
                                  {hasExtraText
                                    ? "Your output contains the expected value but also has extra text or a different format. Print only the exact required output. For example, print [0, 1], not Indices: [0, 1]."
                                    : test?.message || "Your output does not exactly match the expected output. Check the algorithm, input handling, and output format."}
                                </div>
                              )}
                              {test?.message && !passed && !hasExtraText && (
                                <p className="mt-2 text-xs text-slate-600">Evaluator details: {test.message}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-800">All Your Submissions</h3>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {filteredSubmissionEntries.length} of {allSubmissionEntries.length} submissions
                      </span>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <input
                        type="search"
                        value={submissionSearch}
                        onChange={(event) => setSubmissionSearch(event.target.value)}
                        placeholder="Search question..."
                        aria-label="Search submissions by question"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      />
                      <select
                        value={submissionFilter}
                        onChange={(event) => setSubmissionFilter(event.target.value)}
                        aria-label="Filter submissions by result"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
                      >
                        <option value="All">All results</option>
                        <option value="Accepted">Accepted / Passed</option>
                        <option value="Failed">Failed (Wrong Answer / Errors)</option>
                        <option value="Not evaluated">Not evaluated</option>
                      </select>
                      <select
                        value={submissionLanguageFilter}
                        onChange={(event) => setSubmissionLanguageFilter(event.target.value)}
                        aria-label="Filter submissions by programming language"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
                      >
                        <option value="All">All languages</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="javascript">JavaScript</option>
                      </select>
                    </div>

                    {allSubmissionEntries.length === 0 ? (
                      <p className="text-sm text-slate-500">No submissions yet. Submit code for any question to see it here.</p>
                    ) : filteredSubmissionEntries.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                        No submissions match these filters. Try changing the result, language, or search text.
                      </div>
                    ) : (
                      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                        {filteredSubmissionEntries.map((item, index) => {
                          const verdict = String(item.verdict || item.status || "Not evaluated");
                          const accepted = item.accepted === true || verdict.toLowerCase() === "accepted" || verdict.toLowerCase() === "passed";
                          const notEvaluated = verdict.toLowerCase() === "not evaluated" || verdict.toLowerCase() === "saved";
                          const verdictClass = accepted
                            ? "bg-emerald-100 text-emerald-700"
                            : notEvaluated
                              ? "bg-slate-100 text-slate-600"
                              : "bg-rose-100 text-rose-700";

                          return (
                            <div
                              key={`${item.problemId}-${item.submittedAt}-${index}`}
                              className="rounded-lg border border-slate-200 p-3"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <h4 className="font-semibold text-slate-800">
                                  {item.problemTitle || `Question ${item.problemId}`}
                                </h4>
                                <span className={`rounded px-2 py-1 text-xs font-semibold ${verdictClass}`}>
                                  {verdict}
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded bg-indigo-100 px-2 py-1 font-semibold text-indigo-700">
                                  {(item.language || "java").toUpperCase()}
                                </span>
                                {Number.isFinite(Number(item.total)) && Number(item.total) > 0 && (
                                  <span className="text-slate-500">{Number(item.passed) || 0}/{Number(item.total)} tests</span>
                                )}
                                <span className="text-slate-500">
                                  {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Saved submission"}
                                </span>
                              </div>

                              <button
                                type="button"
                                className="mt-3 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                                onClick={() => {
                                  const problem = problems.find((p) =>
                                    String(p.id ?? p._id ?? p.title) === String(item.problemId)
                                  );
                                  if (problem) {
                                    setSelectedProblem(problem);
                                    setAiFeedback(readCachedAIFeedback(problem, item.language || "java"));
                                  }
                                  setCode(item.code || "");
                                  setLanguage(item.language || "java");
                                  setSubmissionStatus(`Restored ${item.problemTitle || "submission"}. You can edit and submit again.`);
                                }}
                              >
                                Restore Code
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                <div className={cardClass}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">Program Output</h3>

                    <button
                      onClick={() => setOutput("")}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                    >
                      Clear
                    </button>
                  </div>

                  <pre className="mt-4 min-h-40 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 font-mono text-sm leading-6 text-emerald-300">
                    {output ||
                      "Your program output will appear here."}
                  </pre>

                  {aiFeedback && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 text-white">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl shadow-inner">✧</span>
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold tracking-wide">AI Mentor Feedback</h3>
                          <p className="mt-1 text-xs text-indigo-100">Code review · Explanation · Suggestions to improve</p>
                        </div>
                        {!isFeedbackLoading && <span className="ml-auto shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white">Review ready</span>}
                      </div>
                      <div className="max-h-[680px] overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-5 py-5 sm:px-6">
                        <div className="max-w-none break-words text-[15px] leading-7 text-slate-700
                          [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:pb-2 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900
                          [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:rounded-lg [&_h2]:border-l-4 [&_h2]:border-indigo-500 [&_h2]:bg-indigo-50 [&_h2]:px-3 [&_h2]:py-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-indigo-950
                          [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900
                          [&_p]:my-3 [&_p]:leading-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
                          [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_li::marker]:font-bold [&_li::marker]:text-indigo-500
                          [&_blockquote]:my-4 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:bg-amber-50 [&_blockquote]:px-4 [&_blockquote]:py-3
                          [&_hr]:my-6 [&_hr]:border-slate-200 [&_strong]:font-bold [&_strong]:text-slate-900
                          [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2
                          [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-emerald-300 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
                          [&_code]:rounded-md [&_code]:bg-indigo-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-indigo-800">
                          <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>


            </section>
          )}

          {activePage === "AI Mentor" && (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">
                  AI Coding Mentor ✧
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Write code in the editor and request AI feedback
                  to receive suggestions.
                </p>
              </div>

              <div className={`${cardClass} w-full max-w-6xl`}>
                <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 sm:p-6 text-white">
                  <h3 className="text-xl font-bold">
                    Your personal coding assistant
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    Get help understanding your solution,
                    improving readability and identifying possible
                    improvements.
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold">
                    Current language:{" "}
                    {language === "java" ? "Java" : "C++"}
                  </p>

                  <pre className="mt-3 max-h-56 sm:max-h-64 overflow-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-emerald-300">
                    {code}
                  </pre>

                  <button
                    onClick={openEditor}
                    className={`${secondaryButton} mt-4`}
                  >
                    Open Editor
                  </button>

                  
                </div>
                            {/* AI Code Assistant */}
      <div className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-xl font-bold">
          AI Code Assistant 🤖
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Explain, debug, fix, and optimize your code using AI.
        </p>

        <div className="mt-3">
          <label className="mb-2 block text-sm font-semibold">
            Select Action
          </label>

          <select
            value={assistantAction}
            onChange={(e) => setAssistantAction(e.target.value)}
            className={inputClass}
          >
            <option value="explain">Explain Code</option>
            <option value="debug">Find Errors</option>
            <option value="fix">Fix Code</option>
            <option value="optimize">Optimize Code</option>
            <option value="line-by-line">Line-by-line Explanation</option>
          </select>
        </div>

        <textarea
          value={assistantQuestion}
          onChange={(e) => setAssistantQuestion(e.target.value)}
          placeholder="Ask a question (optional)..."
          rows={2}
          className={`${inputClass} mt-3 w-full`}
        />

        <button
          onClick={runAICodeAssistant}
          disabled={isAssistantLoading}
          className={`${primaryButton} mt-3`}
        >
          {isAssistantLoading ? "AI is Working..." : "Run AI Code Assistant"}
        </button>

        {assistantResult && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-4 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">✧</span>
              <div>
                <h4 className="font-extrabold tracking-wide">AI Mentor Response</h4>
                <p className="mt-1 text-xs text-indigo-100">Step-by-step explanation and coding guidance</p>
              </div>
            </div>
            <div className="max-h-[760px] overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-5 py-5 sm:px-7 sm:py-6">
              <div className="max-w-none break-words text-[15px] leading-7 text-slate-700
                [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:pb-2 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900
                [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:rounded-lg [&_h2]:border-l-4 [&_h2]:border-indigo-500 [&_h2]:bg-indigo-50 [&_h2]:px-3 [&_h2]:py-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-indigo-950
                [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900
                [&_p]:my-3 [&_p]:leading-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
                [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_li::marker]:text-indigo-500
                [&_blockquote]:my-4 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:bg-amber-50 [&_blockquote]:px-4 [&_blockquote]:py-3
                [&_hr]:my-6 [&_hr]:border-slate-200 [&_strong]:font-bold [&_strong]:text-slate-900
                [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-emerald-300 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
                [&_code]:rounded-md [&_code]:bg-indigo-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-indigo-800">
                <ReactMarkdown>{assistantResult}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
                
              </div>
            </section>
          )}

          {activePage === "My Progress" && (() => {
            const locallySolvedProblems = problems.filter((problem) => getProblemStatus(problem) === "solved");
            const difficultyData = ["Easy", "Medium", "Hard"].map((difficulty) => ({
              difficulty,
              solved: locallySolvedProblems.filter((problem) => problem.difficulty === difficulty).length,
            }));

            const roadmapData = roadmapModules.map((module) => ({
              topic: module.title.length > 22
                ? `${module.title.slice(0, 19)}...`
                : module.title,
              progress: getRoadmapModuleStatus(module).progress,
            }));

            return (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">My Progress 📊</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Track your coding practice, solved problems and learning performance.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Problems Solved", value: solvedProblemCount },
                    { label: "Easy", value: difficultyData[0].solved },
                    { label: "Medium", value: difficultyData[1].solved },
                    { label: "Hard", value: difficultyData[2].solved },
                  ].map((item) => (
                    <div key={item.label} className={cardClass}>
                      <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-black text-indigo-600">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className={cardClass}>
                    <h3 className="text-lg font-bold">Problems Solved by Difficulty</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Compare how many Easy, Medium and Hard problems you have solved.
                    </p>
                    <div className="mt-5 h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={difficultyData} margin={{ top: 10, right: 12, left: -18, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="difficulty" tick={{ fill: "#64748b", fontSize: 12 }} />
                          <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="solved" name="Problems solved" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={cardClass}>
                    <h3 className="text-lg font-bold">Learning Roadmap Performance</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Completion percentage for each learning module.
                    </p>
                    <div className="mt-5 h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={roadmapData} margin={{ top: 10, right: 12, left: -12, bottom: 35 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="topic" interval={0} angle={-25} textAnchor="end" height={65} tick={{ fill: "#64748b", fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#64748b", fontSize: 12 }} />
                          <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
                          <Line type="monotone" dataKey="progress" name="Completion" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">Solved Problems</h3>
                      <p className="mt-1 text-sm text-slate-500">Your saved coding practice history.</p>
                    </div>
                    {progressLoading && <span className="text-sm text-slate-500">Loading...</span>}
                  </div>

                  {locallySolvedProblems.length === 0 ? (
                    <p className="mt-5 text-sm text-slate-500">
                      No accepted submissions yet. Solve a problem in Coding Practice to see your progress here.
                    </p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {locallySolvedProblems.map((problem) => {
                        const saved = savedProblemSubmissions[getProblemSubmissionId(problem)];
                        const attempts = Array.isArray(saved?.history) ? saved.history : saved?.latest ? [saved.latest] : [];
                        const acceptedAttempt = [...attempts].reverse().find((attempt) => String(attempt?.verdict || attempt?.status || "").trim().toLowerCase() === "accepted" || attempt?.accepted === true);
                        return (
                          <div key={problem.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                            <div>
                              <h4 className="font-semibold">{problem.title}</h4>
                              <p className="mt-1 text-xs text-slate-500">Difficulty: {problem.difficulty} · Language: {acceptedAttempt?.language || "java"}</p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">✓ Solved</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })()}

          {activePage === "Learning Roadmap" && (
            <section className="space-y-7 pb-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-lg shadow-indigo-200 sm:p-8">
                <div className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full border-[24px] border-white/10" />
                <div className="pointer-events-none absolute right-24 top-24 h-24 w-24 rounded-full bg-fuchsia-400/20 blur-2xl" />
                <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-50">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" /> YOUR LEARNING JOURNEY
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Learning Roadmap</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                      Build strong foundations one step at a time. Track your progress, celebrate milestones, and keep moving forward.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-white/30 bg-white/10 text-xl font-extrabold shadow-inner">
                      {averageRoadmapProgress}%
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-100">Overall progress</p>
                      <p className="mt-1 text-2xl font-black">{completedCount}<span className="text-base font-semibold text-indigo-100"> / {roadmapModules.length}</span></p>
                      <p className="text-xs text-indigo-100">modules completed</p>
                    </div>
                  </div>
                </div>
                <div className="relative mt-7 h-2.5 overflow-hidden rounded-full bg-black/20">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-200 transition-all duration-500" style={{ width: `${averageRoadmapProgress}%` }} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Total modules</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">▦</span>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">{roadmapModules.length}</p>
                  <p className="mt-1 text-xs text-slate-500">Your structured learning path</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Completed</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">✓</span>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">{completedCount}</p>
                  <p className="mt-1 text-xs text-slate-500">Every completed step counts</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Remaining</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">↗</span>
                  </div>
                  <p className="mt-3 text-3xl font-black text-slate-900">{Math.max(roadmapModules.length - completedCount, 0)}</p>
                  <p className="mt-1 text-xs text-slate-500">Keep your momentum going</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Your learning path</h3>
                  <p className="mt-1 text-sm text-slate-500">Complete each module as you master the topic.</p>
                </div>
                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">{completedCount} of {roadmapModules.length} done</span>
              </div>

              <div className="space-y-3">
                {roadmapModules.map((module, index) => {
                  const isCompleted = completedModules.includes(module.title);
                  const progress = isCompleted ? 100 : module.progress;
                  return (
                    <article key={module.title} className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${isCompleted ? "border-emerald-200" : "border-slate-200 hover:border-indigo-200"}`}>
                      {isCompleted && <div className="absolute inset-y-0 left-0 w-1 bg-emerald-400" />}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold ${isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100"}`}>
                          {isCompleted ? "✓" : String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900">{module.title}</h4>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{isCompleted ? "COMPLETED" : `MODULE ${index + 1}`}</span>
                          </div>
                          <p className="mt-1 text-sm leading-5 text-slate-500">{module.description}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className={`w-10 text-right text-xs font-bold ${isCompleted ? "text-emerald-700" : "text-slate-500"}`}>{progress}%</span>
                          </div>
                        </div>
                        <button onClick={() => toggleModuleCompletion(module.title)} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 ${isCompleted ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-indigo-600 text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700"}`}>
                          {isCompleted ? "✓ Completed" : "Mark complete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className={cardClass}>
                <h3 className="text-lg font-bold">
                  Create Your Own Roadmap
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add a topic you want to learn, such as Java,
                  React, SQL or Data Structures.
                </p>

                <form
                  onSubmit={addCustomRoadmap}
                  className="mt-5 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    value={customRoadmapTopic}
                    onChange={(event) =>
                      setCustomRoadmapTopic(event.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter a topic to learn..."
                    required
                  />

                  <button
                    type="submit"
                    className={`${primaryButton} shrink-0`}
                  >
                    + Add Roadmap
                  </button>
                </form>

                {customRoadmaps.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {customRoadmaps.map((roadmap) => (
                      <div
                        key={roadmap.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                      >
                        <div>
                          <p className="font-semibold">
                            {roadmap.topic}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Custom learning roadmap
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            setCustomRoadmaps((previous) =>
                              previous.filter(
                                (item) => item.id !== roadmap.id
                              )
                            )
                          }
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activePage === "Beginner Zone" && (
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold">
                  Beginner Zone
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Build your fundamentals with guided lessons,
                  quizzes and beginner-friendly practice.
                </p>
              </div>

              <BeginnerZone />
            </section>
          )}
          {activePage === "AI Assistant" && (
  <AiAssistantPage
    onNavigate={(page) => setActivePage(page)}
  />
)}
        </main>
      </div>
    </div>
  );
}

export default App;