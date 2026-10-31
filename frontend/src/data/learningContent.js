const learningContent = {
  java: {
    id: "java",
    title: "Java Programming",
    description:
      "Learn Java programming from the basics to object-oriented programming.",
    icon: "☕",
    level: "Beginner",

    modules: [
      {
        id: "introduction",
        title: "Introduction to Java",
        description: "Understand Java and write your first program.",
        duration: "30 min",

        lessons: [
          {
            id: "what-is-java",
            title: "What is Java?",
            duration: "10 min",

            content: `
# What is Java?

Java is a high-level, class-based programming language.

It is widely used for backend development, enterprise applications,
Android development, and many other software applications.

## Features of Java

- Platform independent
- Object-oriented
- Strongly typed
- Secure
- Automatic memory management
- Large ecosystem of libraries

## How does Java work?

1. Write Java source code in a .java file.
2. The Java compiler converts it into bytecode.
3. The Java Virtual Machine (JVM) executes the bytecode.

The bytecode can run on different operating systems when a compatible
JVM is available.
            `,

            keyPoints: [
              "Java is a high-level programming language.",
              "Java source files use the .java extension.",
              "The compiler generates bytecode.",
              "The JVM executes Java bytecode.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,

            output: `Hello, Java!`,
          },

          {
            id: "java-installation",
            title: "JDK, JRE and JVM",
            duration: "10 min",

            content: `
# JDK, JRE and JVM

These three terms are important when learning Java.

## 1. JVM

JVM stands for Java Virtual Machine.

It executes Java bytecode.

## 2. JRE

JRE stands for Java Runtime Environment.

It provides the runtime components needed to run Java applications.

## 3. JDK

JDK stands for Java Development Kit.

It provides development tools, including the Java compiler.

## Remember

- JVM: Executes bytecode.
- JRE: Provides the runtime environment.
- JDK: Provides tools to develop Java programs.
            `,

            keyPoints: [
              "JVM executes bytecode.",
              "JRE provides the Java runtime environment.",
              "JDK provides tools for Java development.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        System.out.println("Java Development");
    }
}`,

            output: `Java Development`,
          },

          {
            id: "first-java-program",
            title: "Your First Java Program",
            duration: "10 min",

            content: `
# Your First Java Program

Let's understand a basic Java program.

## Program structure

- class Main: Declares a class named Main.
- main(): The standard entry point used to launch this program.
- System.out.println(): Prints text and moves to the next line.

Java is case-sensitive. For example, Main and main are different.

The file name must be Main.java when using this public class name
convention with a public class. In this example, Main is not public,
so it can also be compiled from Main.java.
            `,

            keyPoints: [
              "Java code is organized into classes.",
              "The main method is the program entry point.",
              "System.out.println() prints a line of text.",
              "Java is case-sensitive.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        System.out.println("My first program");
        System.out.println("I am learning Java");
    }
}`,

            output: `My first program
I am learning Java`,
          },
        ],
      },

      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Learn how to store and work with data.",
        duration: "45 min",

        lessons: [
          {
            id: "variables-basics",
            title: "Variables in Java",
            duration: "15 min",

            content: `
# Variables in Java

A variable is a named storage location used to hold a value.

## Syntax

dataType variableName = value;

## Examples

- int age = 20;
- double price = 99.50;
- char grade = 'A';
- boolean isLearning = true;
- String name = "Vishal";

The data type determines what kind of value a variable can store.
            `,

            keyPoints: [
              "Variables store values.",
              "Every variable has a type.",
              "Variable names are case-sensitive.",
              "Java uses static typing.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int age = 20;
        String name = "Student";

        System.out.println(name);
        System.out.println(age);
    }
}`,

            output: `Student
20`,
          },

          {
            id: "primitive-data-types",
            title: "Primitive Data Types",
            duration: "15 min",

            content: `
# Primitive Data Types

Java has eight primitive data types.

| Type | Description |
|---|---|
| byte | Small integer |
| short | Short integer |
| int | Integer |
| long | Large integer |
| float | Single-precision decimal |
| double | Double-precision decimal |
| char | Single UTF-16 code unit |
| boolean | true or false |

## Example

int marks = 85;

double percentage = 85.5;

char grade = 'A';

boolean passed = true;
            `,

            keyPoints: [
              "Java has eight primitive data types.",
              "int is commonly used for whole numbers.",
              "double is commonly used for decimal values.",
              "boolean stores true or false.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int marks = 85;
        double percentage = 85.5;
        char grade = 'A';
        boolean passed = true;

        System.out.println(marks);
        System.out.println(percentage);
        System.out.println(grade);
        System.out.println(passed);
    }
}`,

            output: `85
85.5
A
true`,
          },

          {
            id: "type-casting",
            title: "Type Casting",
            duration: "15 min",

            content: `
# Type Casting

Type casting converts a value from one data type to another.

## Widening Casting

A smaller compatible type is converted to a larger type.

Example:

int number = 10;
double value = number;

This conversion happens automatically.

## Narrowing Casting

A value is explicitly converted to a smaller compatible type.

Example:

double price = 10.75;
int value = (int) price;

The fractional part is discarded, so value becomes 10.
            `,

            keyPoints: [
              "Widening conversions are generally automatic.",
              "Narrowing conversions often require an explicit cast.",
              "Casting can cause loss of information.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int number = 10;
        double value = number;

        double price = 10.75;
        int wholePrice = (int) price;

        System.out.println(value);
        System.out.println(wholePrice);
    }
}`,

            output: `10.0
10`,
          },
        ],
      },

      {
        id: "operators",
        title: "Operators & Conditions",
        description: "Learn operators and decision-making statements.",
        duration: "45 min",

        lessons: [
          {
            id: "operators-basics",
            title: "Operators in Java",
            duration: "15 min",

            content: `
# Operators in Java

Operators perform operations on values and variables.

## Arithmetic Operators

+, -, *, /, %

## Comparison Operators

==, !=, >, <, >=, <=

## Logical Operators

&&, ||, !

## Assignment Operators

=, +=, -=, *=, /=

The modulus operator % returns the remainder of a division.
            `,

            keyPoints: [
              "Arithmetic operators perform calculations.",
              "Comparison operators produce boolean results.",
              "Logical operators combine boolean expressions.",
              "The modulus operator returns a remainder.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println(a + b);
        System.out.println(a % b);
        System.out.println(a > b);
    }
}`,

            output: `13
1
true`,
          },

          {
            id: "if-else",
            title: "If-Else Statements",
            duration: "15 min",

            content: `
# If-Else Statements

Conditional statements allow a program to make decisions.

## Syntax

if (condition) {
    // Executes when condition is true
} else {
    // Executes when condition is false
}

You can also use else if when multiple conditions need to be checked.
            `,

            keyPoints: [
              "if executes a block when its condition is true.",
              "else handles the alternative case.",
              "else if checks additional conditions.",
              "Conditions generally evaluate to boolean values.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int marks = 75;

        if (marks >= 40) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }
    }
}`,

            output: `Pass`,
          },

          {
            id: "switch",
            title: "Switch Statement",
            duration: "15 min",

            content: `
# Switch Statement

A switch statement selects a branch based on a value.

It is useful when one expression is compared against several cases.

A traditional switch statement can use break to prevent execution
from falling through into subsequent case labels.
            `,

            keyPoints: [
              "switch selects a matching case.",
              "break exits a traditional switch statement.",
              "default handles cases without a matching label.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int day = 2;

        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            default:
                System.out.println("Other day");
        }
    }
}`,

            output: `Tuesday`,
          },
        ],
      },

      {
        id: "loops",
        title: "Loops",
        description: "Repeat tasks using Java loops.",
        duration: "45 min",

        lessons: [
          {
            id: "for-loop",
            title: "For Loop",
            duration: "15 min",

            content: `
# For Loop

A for loop repeats a block of code while its condition is true.

It commonly contains three parts:

1. Initialization
2. Condition
3. Update

It is useful when the repetition pattern is known.
            `,

            keyPoints: [
              "A for loop can repeat a block multiple times.",
              "Initialization runs before the first iteration.",
              "The condition is checked before each iteration.",
              "The update expression runs after each iteration.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,

            output: `1
2
3
4
5`,
          },

          {
            id: "while-loop",
            title: "While Loop",
            duration: "15 min",

            content: `
# While Loop

A while loop repeats a block while its condition is true.

The condition is checked before each iteration.

If the condition is false initially, the loop body does not execute.
            `,

            keyPoints: [
              "while checks the condition before execution.",
              "The loop can execute zero or more times.",
              "Update loop variables carefully to avoid infinite loops.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int i = 1;

        while (i <= 3) {
            System.out.println(i);
            i++;
        }
    }
}`,

            output: `1
2
3`,
          },

          {
            id: "do-while-loop",
            title: "Do-While Loop",
            duration: "15 min",

            content: `
# Do-While Loop

A do-while loop executes its body before checking the condition.

Therefore, the loop body executes at least once.

Remember to place a semicolon after the while condition.
            `,

            keyPoints: [
              "The body executes before the condition is checked.",
              "A do-while loop executes at least once.",
              "The statement ends with a semicolon.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int i = 1;

        do {
            System.out.println(i);
            i++;
        } while (i <= 3);
    }
}`,

            output: `1
2
3`,
          },
        ],
      },

      {
        id: "arrays-strings",
        title: "Arrays & Strings",
        description: "Store collections of values and manipulate text.",
        duration: "45 min",

        lessons: [
          {
            id: "arrays",
            title: "Arrays in Java",
            duration: "15 min",

            content: `
# Arrays in Java

An array stores multiple values of the same type.

Array indexes start at 0.

For an array containing five elements, valid indexes are 0 through 4.

The length property gives the number of elements in an array.
            `,

            keyPoints: [
              "Arrays store multiple values of one type.",
              "Array indexing starts at zero.",
              "The length property gives the array size.",
              "Accessing an invalid index causes an exception.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};

        System.out.println(numbers[0]);
        System.out.println(numbers.length);
    }
}`,

            output: `10
3`,
          },

          {
            id: "strings",
            title: "Strings in Java",
            duration: "15 min",

            content: `
# Strings in Java

A String represents a sequence of characters.

Strings are objects in Java and are immutable.

Common String methods include:

- length()
- charAt(index)
- toUpperCase()
- toLowerCase()
- equals()
- contains()

Use equals() to compare String contents.
            `,

            keyPoints: [
              "String objects are immutable.",
              "length() returns the number of characters.",
              "charAt() retrieves a character at an index.",
              "equals() compares String contents.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        String name = "Java";

        System.out.println(name.length());
        System.out.println(name.toUpperCase());
        System.out.println(name.charAt(0));
    }
}`,

            output: `4
JAVA
J`,
          },

          {
            id: "array-traversal",
            title: "Traversing Arrays",
            duration: "15 min",

            content: `
# Traversing Arrays

Traversing means visiting each element in an array.

A for loop is commonly used when you need the index.

An enhanced for loop is useful when you only need each element.
            `,

            keyPoints: [
              "Loops can visit each array element.",
              "Use indexes when positions matter.",
              "Enhanced for loops simplify reading elements.",
            ],

            code: `class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};

        for (int number : numbers) {
            System.out.println(number);
        }
    }
}`,

            output: `10
20
30`,
          },
        ],
      },

      {
        id: "oops",
        title: "Object-Oriented Programming",
        description: "Understand classes, objects, inheritance and more.",
        duration: "60 min",

        lessons: [
          {
            id: "classes-objects",
            title: "Classes and Objects",
            duration: "20 min",

            content: `
# Classes and Objects

A class defines the structure and behavior of objects.

An object is an instance of a class.

Classes can contain fields, constructors and methods.

Objects are commonly created using the new keyword.
            `,

            keyPoints: [
              "A class defines a type.",
              "An object is an instance of a class.",
              "Fields store object state.",
              "Methods define behavior.",
            ],

            code: `class Student {
    String name = "Aman";

    void display() {
        System.out.println(name);
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.display();
    }
}`,

            output: `Aman`,
          },

          {
            id: "inheritance",
            title: "Inheritance",
            duration: "20 min",

            content: `
# Inheritance

Inheritance allows one class to acquire accessible members
from another class.

In Java, a class uses the extends keyword to inherit from
another class.

Inheritance can support code reuse and polymorphic behavior.
            `,

            keyPoints: [
              "extends declares class inheritance.",
              "A subclass inherits accessible superclass members.",
              "Java classes support single class inheritance.",
              "Constructors are not inherited.",
            ],

            code: `class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
}

class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.sound();
    }
}`,

            output: `Animal sound`,
          },

          {
            id: "polymorphism-encapsulation",
            title: "Polymorphism and Encapsulation",
            duration: "20 min",

            content: `
# Polymorphism and Encapsulation

## Polymorphism

Polymorphism allows the same method call or interface to have
different behavior depending on the object or context.

Method overriding is a common example of runtime polymorphism.

## Encapsulation

Encapsulation combines data and methods and controls access
to an object's internal state.

Private fields with public methods are a common implementation pattern.
            `,

            keyPoints: [
              "Polymorphism allows different implementations of behavior.",
              "Method overriding supports runtime polymorphism.",
              "Encapsulation controls access to internal state.",
              "Access modifiers help implement encapsulation.",
            ],

            code: `class Student {
    private int marks;

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public int getMarks() {
        return marks;
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.setMarks(90);

        System.out.println(student.getMarks());
    }
}`,

            output: `90`,
          },
        ],
      },
    ],
  },

  cpp: {
    id: "cpp",
    title: "C++ Programming",
    description:
      "Learn C++ fundamentals, conditions, loops, arrays and object-oriented programming.",
    icon: "⚙️",
    level: "Beginner",

    modules: [
      {
        id: "introduction",
        title: "Introduction to C++",
        description: "Understand C++ and write your first program.",
        duration: "30 min",

        lessons: [
          {
            id: "what-is-cpp",
            title: "What is C++?",
            duration: "10 min",

            content: `
# What is C++?

C++ is a general-purpose programming language that supports
procedural and object-oriented programming.

It is used in system software, games, performance-sensitive
applications and competitive programming.

C++ source files commonly use the .cpp extension.
            `,

            keyPoints: [
              "C++ is a general-purpose programming language.",
              "C++ supports procedural and object-oriented programming.",
              "C++ is commonly used for competitive programming.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,

            output: `Hello, C++!`,
          },

          {
            id: "cpp-program-structure",
            title: "Structure of a C++ Program",
            duration: "10 min",

            content: `
# Structure of a C++ Program

- #include <iostream> provides standard input/output functionality.
- main() is the program entry point.
- cout prints output.
- return 0 indicates successful completion.
            `,

            keyPoints: [
              "iostream provides standard input/output tools.",
              "main() is the entry point.",
              "cout prints output to the console.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    cout << "Learning C++" << endl;
    return 0;
}`,

            output: `Learning C++`,
          },

          {
            id: "cpp-output",
            title: "Output in C++",
            duration: "10 min",

            content: `
# Output in C++

The cout stream is commonly used to display output.

The insertion operator << sends values to the output stream.

The endl manipulator ends the line and flushes the stream.
            `,

            keyPoints: [
              "cout is used for standard output.",
              "The << operator inserts values into the output stream.",
              "endl ends a line and flushes the stream.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello" << endl;
    cout << "World" << endl;
    return 0;
}`,

            output: `Hello
World`,
          },
        ],
      },

      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Store values using C++ data types.",
        duration: "30 min",

        lessons: [
          {
            id: "cpp-variables",
            title: "Variables in C++",
            duration: "10 min",

            content: `
# Variables in C++

Variables store values that a program can use.

Examples:

int age = 20;
double price = 99.5;
char grade = 'A';
bool passed = true;
string name = "Student";

To use string, include the <string> header.
            `,

            keyPoints: [
              "Variables have names and types.",
              "int stores whole numbers.",
              "double stores floating-point values.",
              "bool stores true or false.",
            ],

            code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 20;
    string name = "Student";

    cout << name << endl;
    cout << age << endl;
    return 0;
}`,

            output: `Student
20`,
          },

          {
            id: "cpp-data-types",
            title: "Data Types",
            duration: "10 min",

            content: `
# Data Types in C++

Common C++ data types include:

- int
- float
- double
- char
- bool
- string

The string type is provided by the standard library and is not
a built-in fundamental type.
            `,

            keyPoints: [
              "C++ provides several fundamental data types.",
              "string is part of the standard library.",
              "Choose a type suitable for the data.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int marks = 80;
    double percentage = 80.5;
    char grade = 'B';
    bool passed = true;

    cout << marks << endl;
    cout << percentage << endl;
    cout << grade << endl;
    cout << passed << endl;
    return 0;
}`,

            output: `80
80.5
B
1`,
          },

          {
            id: "cpp-constants",
            title: "Constants",
            duration: "10 min",

            content: `
# Constants in C++

A constant represents a value that cannot be modified
through that constant declaration after initialization.

Use the const keyword to declare a constant.
            `,

            keyPoints: [
              "const declares an immutable variable.",
              "A const variable normally needs initialization.",
              "Constants help prevent accidental changes.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    const double PI = 3.14159;
    cout << PI << endl;
    return 0;
}`,

            output: `3.14159`,
          },
        ],
      },

      {
        id: "operators",
        title: "Operators & Conditions",
        description: "Perform calculations and make decisions.",
        duration: "30 min",

        lessons: [
          {
            id: "cpp-operators",
            title: "Operators in C++",
            duration: "10 min",

            content: `
# Operators in C++

C++ supports arithmetic, comparison, logical and assignment operators.

Examples:

Arithmetic: +, -, *, /, %
Comparison: ==, !=, >, <
Logical: &&, ||, !
Assignment: =, +=, -=
            `,

            keyPoints: [
              "Operators perform calculations and comparisons.",
              "Comparison operators produce boolean results.",
              "Logical operators combine conditions.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 3;

    cout << a + b << endl;
    cout << a % b << endl;
    cout << (a > b) << endl;
    return 0;
}`,

            output: `13
1
1`,
          },

          {
            id: "cpp-if-else",
            title: "If-Else Statements",
            duration: "10 min",

            content: `
# If-Else Statements

if and else let a program choose between different paths
based on a condition.

Use else if to test additional conditions.
            `,

            keyPoints: [
              "if checks a condition.",
              "else handles the alternative case.",
              "else if checks additional conditions.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int marks = 75;

    if (marks >= 40) {
        cout << "Pass";
    } else {
        cout << "Fail";
    }

    return 0;
}`,

            output: `Pass`,
          },

          {
            id: "cpp-switch",
            title: "Switch Statement",
            duration: "10 min",

            content: `
# Switch Statement

A switch statement selects a matching case.

In a traditional switch statement, break prevents execution
from falling through into the next case.
            `,

            keyPoints: [
              "switch selects a matching case.",
              "break exits the switch.",
              "default handles unmatched cases.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int day = 2;

    switch (day) {
        case 1:
            cout << "Monday";
            break;
        case 2:
            cout << "Tuesday";
            break;
        default:
            cout << "Other day";
    }

    return 0;
}`,

            output: `Tuesday`,
          },
        ],
      },

      {
        id: "loops",
        title: "Loops",
        description: "Repeat operations using loops.",
        duration: "30 min",

        lessons: [
          {
            id: "cpp-for-loop",
            title: "For Loop",
            duration: "10 min",

            content: `
# For Loop

A for loop is useful when you know the initialization,
condition and update required for repetition.
            `,

            keyPoints: [
              "A for loop repeats a block of code.",
              "Initialization runs before the first iteration.",
              "The condition is checked before each iteration.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }
    return 0;
}`,

            output: `1
2
3
4
5`,
          },

          {
            id: "cpp-while-loop",
            title: "While Loop",
            duration: "10 min",

            content: `
# While Loop

A while loop checks its condition before executing the body.
It can execute zero or more times.
            `,

            keyPoints: [
              "while checks the condition first.",
              "Update variables carefully.",
              "An unchanged true condition may cause an infinite loop.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int i = 1;

    while (i <= 3) {
        cout << i << endl;
        i++;
    }

    return 0;
}`,

            output: `1
2
3`,
          },

          {
            id: "cpp-do-while",
            title: "Do-While Loop",
            duration: "10 min",

            content: `
# Do-While Loop

A do-while loop executes its body before checking the condition.
Therefore, the body executes at least once.
            `,

            keyPoints: [
              "The body executes before the condition check.",
              "A do-while loop runs at least once.",
              "The condition ends with a semicolon.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int i = 1;

    do {
        cout << i << endl;
        i++;
    } while (i <= 3);

    return 0;
}`,

            output: `1
2
3`,
          },
        ],
      },

      {
        id: "arrays-strings",
        title: "Arrays & Strings",
        description: "Work with collections and text.",
        duration: "30 min",

        lessons: [
          {
            id: "cpp-arrays",
            title: "Arrays in C++",
            duration: "10 min",

            content: `
# Arrays in C++

An array stores multiple values of the same type.

Array indexes start at zero.
For an array of size three, the valid indexes are 0, 1 and 2.
            `,

            keyPoints: [
              "Arrays store multiple values of the same type.",
              "Indexing starts at zero.",
              "Accessing invalid indexes can cause undefined behavior.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int numbers[] = {10, 20, 30};

    cout << numbers[0] << endl;
    cout << sizeof(numbers) / sizeof(numbers[0]) << endl;
    return 0;
}`,

            output: `10
3`,
          },

          {
            id: "cpp-strings",
            title: "Strings in C++",
            duration: "10 min",

            content: `
# Strings in C++

The std::string type represents text.

Include the <string> header to use it.

Common operations include getting length, joining strings
and accessing characters.
            `,

            keyPoints: [
              "std::string represents text.",
              "Include <string> when using std::string.",
              "The length() method returns the string length.",
            ],

            code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "C++";

    cout << name.length() << endl;
    cout << name << endl;
    return 0;
}`,

            output: `3
C++`,
          },

          {
            id: "cpp-array-traversal",
            title: "Traversing Arrays",
            duration: "10 min",

            content: `
# Traversing Arrays

Traversing means visiting each element in an array.

A loop can process each element one at a time.
            `,

            keyPoints: [
              "Loops can process every array element.",
              "Use valid indexes.",
              "Range-based for loops simplify iteration.",
            ],

            code: `#include <iostream>
using namespace std;

int main() {
    int numbers[] = {10, 20, 30};

    for (int number : numbers) {
        cout << number << endl;
    }

    return 0;
}`,

            output: `10
20
30`,
          },
        ],
      },

      {
        id: "oops",
        title: "Object-Oriented Programming",
        description: "Learn classes, objects and inheritance.",
        duration: "45 min",

        lessons: [
          {
            id: "cpp-classes-objects",
            title: "Classes and Objects",
            duration: "15 min",

            content: `
# Classes and Objects in C++

A class defines data and behavior.

An object is an instance of a class.

In a C++ class, members are private by default.
Use public to expose members when needed.
            `,

            keyPoints: [
              "A class defines a user-defined type.",
              "An object is an instance of a class.",
              "Class members are private by default.",
            ],

            code: `#include <iostream>
using namespace std;

class Student {
public:
    string name = "Aman";

    void display() {
        cout << name << endl;
    }
};

int main() {
    Student student;
    student.display();
    return 0;
}`,

            output: `Aman`,
          },

          {
            id: "cpp-inheritance",
            title: "Inheritance",
            duration: "15 min",

            content: `
# Inheritance in C++

Inheritance lets a derived class reuse accessible members
of a base class.

C++ supports several inheritance forms, including public,
protected and private inheritance.
            `,

            keyPoints: [
              "A derived class can inherit from a base class.",
              "Inheritance can support code reuse.",
              "Inheritance access affects member accessibility.",
            ],

            code: `#include <iostream>
using namespace std;

class Animal {
public:
    void sound() {
        cout << "Animal sound" << endl;
    }
};

class Dog : public Animal {
};

int main() {
    Dog dog;
    dog.sound();
    return 0;
}`,

            output: `Animal sound`,
          },

          {
            id: "cpp-encapsulation",
            title: "Encapsulation",
            duration: "15 min",

            content: `
# Encapsulation in C++

Encapsulation combines data and functions in a class
and controls access to internal state.

Private members can be accessed through public member functions.
            `,

            keyPoints: [
              "private members are not directly accessible from outside.",
              "Public methods can provide controlled access.",
              "Encapsulation helps protect object state.",
            ],

            code: `#include <iostream>
using namespace std;

class Student {
private:
    int marks;

public:
    void setMarks(int value) {
        marks = value;
    }

    int getMarks() {
        return marks;
    }
};

int main() {
    Student student;
    student.setMarks(90);

    cout << student.getMarks() << endl;
    return 0;
}`,

            output: `90`,
          },
        ],
      },
    ],
  },
};

export default learningContent;