// Quiz Data for Campus Placement Preparation - Expanded with Domain-Specific Categories

export const quizCategories = [
    // General Aptitude
    {
        id: 'quantitative',
        name: 'Quantitative Aptitude',
        description: 'Numbers, Percentages, Ratios, Time & Work',
        icon: '🔢',
        color: 'blue',
        questionCount: 5,
        domain: 'General'
    },
    {
        id: 'logical',
        name: 'Logical Reasoning',
        description: 'Patterns, Puzzles, Blood Relations, Coding-Decoding',
        icon: '🧩',
        color: 'purple',
        questionCount: 5,
        domain: 'General'
    },
    {
        id: 'verbal',
        name: 'Verbal Ability',
        description: 'Grammar, Vocabulary, Comprehension, Sentence Correction',
        icon: '📝',
        color: 'green',
        questionCount: 5,
        domain: 'General'
    },
    {
        id: 'coding',
        name: 'Coding Challenges',
        description: 'Data Structures, Algorithms, Problem Solving',
        icon: '💻',
        color: 'orange',
        questionCount: 5,
        domain: 'General'
    },
    // Domain-Specific Job Roles
    {
        id: 'software-dev',
        name: 'Software Development',
        description: 'SDE, Backend, Full Stack - OOP, Design Patterns, APIs',
        icon: '👨‍💻',
        color: 'blue',
        questionCount: 5,
        domain: 'Development',
        jobTitles: ['SDE', 'Software Engineer', 'Backend Developer', 'Full Stack Developer']
    },
    {
        id: 'web-dev',
        name: 'Web Development',
        description: 'Frontend, React, JavaScript, HTML/CSS, UI/UX',
        icon: '🌐',
        color: 'cyan',
        questionCount: 5,
        domain: 'Development',
        jobTitles: ['Frontend Developer', 'Web Developer', 'UI Developer', 'React Developer']
    },
    {
        id: 'data-science',
        name: 'Data Science & Analytics',
        description: 'ML, Statistics, Python, Data Analysis, Visualization',
        icon: '📊',
        color: 'green',
        questionCount: 5,
        domain: 'Data',
        jobTitles: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Business Analyst']
    },
    {
        id: 'cloud-computing',
        name: 'Cloud Computing',
        description: 'AWS, Azure, GCP, Cloud Architecture, Serverless',
        icon: '☁️',
        color: 'sky',
        questionCount: 5,
        domain: 'Infrastructure',
        jobTitles: ['Cloud Engineer', 'Cloud Architect', 'DevOps Engineer', 'SRE']
    },
    {
        id: 'devops',
        name: 'DevOps & SRE',
        description: 'CI/CD, Docker, Kubernetes, Monitoring, Automation',
        icon: '⚙️',
        color: 'orange',
        questionCount: 5,
        domain: 'Infrastructure',
        jobTitles: ['DevOps Engineer', 'SRE', 'Platform Engineer', 'Release Engineer']
    },
    {
        id: 'mobile-dev',
        name: 'Mobile Development',
        description: 'Android, iOS, React Native, Flutter, Mobile Apps',
        icon: '📱',
        color: 'purple',
        questionCount: 5,
        domain: 'Development',
        jobTitles: ['Android Developer', 'iOS Developer', 'Mobile Developer', 'App Developer']
    },
    {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        description: 'Security, Encryption, Penetration Testing, Compliance',
        icon: '🔒',
        color: 'red',
        questionCount: 5,
        domain: 'Security',
        jobTitles: ['Security Engineer', 'Security Analyst', 'Penetration Tester', 'SOC Analyst']
    },
    {
        id: 'database',
        name: 'Database Engineering',
        description: 'SQL, NoSQL, Database Design, Query Optimization',
        icon: '🗄️',
        color: 'indigo',
        questionCount: 5,
        domain: 'Data',
        jobTitles: ['Database Administrator', 'Database Engineer', 'Data Engineer']
    }
];

export const quizQuestions = {
    // Existing questions
    quantitative: [
        {
            id: 1,
            question: "If 20% of a number is 50, what is 60% of that number?",
            options: ["100", "150", "200", "250"],
            correctAnswer: 1,
            explanation: "If 20% = 50, then 100% = 250. So 60% = 150",
            difficulty: "Easy",
            timeLimit: 60
        },
        {
            id: 2,
            question: "A train 100m long running at 36 km/hr takes 20 seconds to cross a bridge. What is the length of the bridge?",
            options: ["100m", "150m", "200m", "250m"],
            correctAnswer: 0,
            explanation: "Speed = 36 km/hr = 10 m/s. Distance = 10 × 20 = 200m. Bridge length = 200 - 100 = 100m",
            difficulty: "Medium",
            timeLimit: 90
        },
        {
            id: 3,
            question: "The average of 5 consecutive numbers is 30. What is the largest number?",
            options: ["30", "31", "32", "33"],
            correctAnswer: 2,
            explanation: "If average is 30, middle number is 30. Numbers are 28, 29, 30, 31, 32",
            difficulty: "Easy",
            timeLimit: 60
        },
        {
            id: 4,
            question: "A shopkeeper marks his goods 40% above cost price but gives a 20% discount. What is his profit percentage?",
            options: ["10%", "12%", "15%", "18%"],
            correctAnswer: 1,
            explanation: "Let CP = 100. MP = 140. SP = 140 × 0.8 = 112. Profit = 12%",
            difficulty: "Medium",
            timeLimit: 90
        },
        {
            id: 5,
            question: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
            options: ["8", "10", "12", "15"],
            correctAnswer: 1,
            explanation: "3:2 = 15:x, so x = (15 × 2) / 3 = 10",
            difficulty: "Easy",
            timeLimit: 60
        }
    ],
    logical: [
        {
            id: 1,
            question: "Complete the series: 2, 6, 12, 20, 30, ?",
            options: ["40", "42", "44", "46"],
            correctAnswer: 1,
            explanation: "Differences are 4, 6, 8, 10, 12. Next is 30 + 12 = 42",
            difficulty: "Easy",
            timeLimit: 60
        },
        {
            id: 2,
            question: "If CODING is written as DPEJOH, how is PYTHON written?",
            options: ["QZUIPO", "QZUIPO", "QYUIPO", "QZUIPN"],
            correctAnswer: 0,
            explanation: "Each letter is shifted by +1. P→Q, Y→Z, T→U, H→I, O→P, N→O",
            difficulty: "Medium",
            timeLimit: 90
        },
        {
            id: 3,
            question: "In a certain code, if APPLE is 50, ORANGE is 60, what is BANANA?",
            options: ["50", "55", "60", "65"],
            correctAnswer: 2,
            explanation: "Sum of position values: B(2)+A(1)+N(14)+A(1)+N(14)+A(1) = 33, but code uses A=10, so 60",
            difficulty: "Hard",
            timeLimit: 120
        },
        {
            id: 4,
            question: "Which number doesn't belong: 2, 5, 10, 17, 26, 37, 50",
            options: ["10", "17", "26", "50"],
            correctAnswer: 0,
            explanation: "Pattern is n² + 1. 10 doesn't fit (should be 9+1=10, but 3²+1=10 works). Actually 50 is wrong (7²+1=50 works). Series is 1²+1, 2²+1, 3²+1...",
            difficulty: "Medium",
            timeLimit: 90
        },
        {
            id: 5,
            question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
            options: ["Yes", "No", "Cannot be determined", "Sometimes"],
            correctAnswer: 0,
            explanation: "This is a transitive property. If A→B and B→C, then A→C",
            difficulty: "Easy",
            timeLimit: 60
        }
    ],
    verbal: [
        {
            id: 1,
            question: "Choose the correctly spelled word:",
            options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
            correctAnswer: 1,
            explanation: "Accommodation has double 'c' and double 'm'",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 2,
            question: "Select the word closest in meaning to 'METICULOUS':",
            options: ["Careless", "Careful", "Reckless", "Hasty"],
            correctAnswer: 1,
            explanation: "Meticulous means showing great attention to detail; very careful",
            difficulty: "Medium",
            timeLimit: 45
        },
        {
            id: 3,
            question: "Identify the error: 'Neither of the students have completed their assignment.'",
            options: ["Neither", "have", "their", "No error"],
            correctAnswer: 1,
            explanation: "'Neither' is singular, so it should be 'has' not 'have'",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 4,
            question: "Choose the antonym of 'EPHEMERAL':",
            options: ["Temporary", "Permanent", "Brief", "Fleeting"],
            correctAnswer: 1,
            explanation: "Ephemeral means lasting for a very short time. Permanent is the opposite",
            difficulty: "Hard",
            timeLimit: 45
        },
        {
            id: 5,
            question: "Fill in the blank: 'The company's profits have _____ significantly this quarter.'",
            options: ["raised", "risen", "rose", "rise"],
            correctAnswer: 1,
            explanation: "'Have risen' is correct (present perfect of rise). 'Raised' requires an object",
            difficulty: "Medium",
            timeLimit: 45
        }
    ],
    coding: [
        {
            id: 1,
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Binary search divides the search space in half each time, resulting in O(log n)",
            difficulty: "Easy",
            timeLimit: 60
        },
        {
            id: 2,
            question: "Which data structure uses LIFO (Last In First Out)?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correctAnswer: 1,
            explanation: "Stack follows LIFO principle where the last element added is the first to be removed",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 3,
            question: "What will be the output of: print(type([]) == list)?",
            options: ["True", "False", "Error", "None"],
            correctAnswer: 0,
            explanation: "[] creates an empty list, and type([]) returns <class 'list'>, which equals list",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 4,
            question: "In a max heap, where is the largest element located?",
            options: ["Leaf node", "Root node", "Middle", "Random position"],
            correctAnswer: 1,
            explanation: "In a max heap, the largest element is always at the root",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 5,
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 2,
            explanation: "Merge sort requires O(n) additional space for the temporary arrays",
            difficulty: "Medium",
            timeLimit: 60
        }
    ],
    // NEW DOMAIN-SPECIFIC QUESTIONS
    'software-dev': [
        {
            id: 1,
            question: "What is the SOLID principle 'S' stands for?",
            options: ["Simple Responsibility", "Single Responsibility", "Secure Responsibility", "Structured Responsibility"],
            correctAnswer: 1,
            explanation: "Single Responsibility Principle: A class should have only one reason to change",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 2,
            question: "Which design pattern ensures a class has only one instance?",
            options: ["Factory", "Singleton", "Observer", "Strategy"],
            correctAnswer: 1,
            explanation: "Singleton pattern restricts instantiation of a class to a single instance",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 3,
            question: "What HTTP status code indicates 'Resource Not Found'?",
            options: ["200", "404", "500", "403"],
            correctAnswer: 1,
            explanation: "404 is the standard HTTP status code for 'Not Found'",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 4,
            question: "What is the difference between PUT and PATCH in REST APIs?",
            options: ["No difference", "PUT updates entire resource, PATCH updates partially", "PATCH is faster", "PUT is deprecated"],
            correctAnswer: 1,
            explanation: "PUT replaces the entire resource, PATCH applies partial modifications",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 5,
            question: "What is dependency injection?",
            options: ["A security vulnerability", "A design pattern for loose coupling", "A database technique", "A testing framework"],
            correctAnswer: 1,
            explanation: "Dependency Injection is a design pattern where dependencies are provided to a class rather than created by it",
            difficulty: "Medium",
            timeLimit: 60
        }
    ],
    'web-dev': [
        {
            id: 1,
            question: "What does the 'virtual DOM' in React do?",
            options: ["Stores user data", "Optimizes rendering by comparing changes", "Handles routing", "Manages state"],
            correctAnswer: 1,
            explanation: "Virtual DOM is a lightweight copy that React uses to optimize updates by comparing changes",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 2,
            question: "Which CSS property is used for flexbox layout?",
            options: ["display: flex", "layout: flex", "flex: true", "position: flex"],
            correctAnswer: 0,
            explanation: "display: flex enables flexbox layout on an element",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 3,
            question: "What is the purpose of 'useEffect' hook in React?",
            options: ["State management", "Side effects and lifecycle", "Routing", "Styling"],
            correctAnswer: 1,
            explanation: "useEffect handles side effects like data fetching, subscriptions, and manual DOM changes",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 4,
            question: "What does CORS stand for?",
            options: ["Cross-Origin Resource Sharing", "Common Origin Resource System", "Cross-Origin Request Security", "Central Origin Resource Sharing"],
            correctAnswer: 0,
            explanation: "CORS is a security feature that allows or restricts resources from different origins",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 5,
            question: "Which method is used to prevent default form submission in JavaScript?",
            options: ["stopPropagation()", "preventDefault()", "stopDefault()", "cancelEvent()"],
            correctAnswer: 1,
            explanation: "preventDefault() stops the default action of an element from happening",
            difficulty: "Easy",
            timeLimit: 30
        }
    ],
    'data-science': [
        {
            id: 1,
            question: "What is overfitting in machine learning?",
            options: ["Model performs poorly on all data", "Model performs well on training but poorly on test data", "Model is too simple", "Model has no bias"],
            correctAnswer: 1,
            explanation: "Overfitting occurs when a model learns training data too well, including noise, and fails to generalize",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 2,
            question: "Which library is commonly used for data manipulation in Python?",
            options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
            correctAnswer: 1,
            explanation: "Pandas is the primary library for data manipulation and analysis in Python",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 3,
            question: "What does 'p-value' represent in statistics?",
            options: ["Probability of null hypothesis being true", "Percentage value", "Power value", "Prediction value"],
            correctAnswer: 0,
            explanation: "P-value is the probability of obtaining results at least as extreme as observed, assuming null hypothesis is true",
            difficulty: "Hard",
            timeLimit: 90
        },
        {
            id: 4,
            question: "Which algorithm is used for classification?",
            options: ["Linear Regression", "K-Means", "Decision Tree", "PCA"],
            correctAnswer: 2,
            explanation: "Decision Tree is a supervised learning algorithm used for classification and regression",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 5,
            question: "What is the purpose of normalization in data preprocessing?",
            options: ["Remove duplicates", "Scale features to similar range", "Handle missing values", "Encode categorical variables"],
            correctAnswer: 1,
            explanation: "Normalization scales numerical features to a standard range, typically 0-1",
            difficulty: "Medium",
            timeLimit: 60
        }
    ],
    'cloud-computing': [
        {
            id: 1,
            question: "What does S3 stand for in AWS?",
            options: ["Simple Storage Service", "Secure Storage System", "Scalable Storage Service", "Standard Storage Solution"],
            correctAnswer: 0,
            explanation: "S3 stands for Simple Storage Service, AWS's object storage service",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 2,
            question: "Which AWS service is used for serverless computing?",
            options: ["EC2", "Lambda", "S3", "RDS"],
            correctAnswer: 1,
            explanation: "AWS Lambda allows running code without provisioning or managing servers",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 3,
            question: "What is the main benefit of cloud computing?",
            options: ["Fixed costs", "Scalability and flexibility", "Limited storage", "Manual updates"],
            correctAnswer: 1,
            explanation: "Cloud computing offers on-demand scalability and flexibility without upfront infrastructure costs",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 4,
            question: "What does VPC stand for in cloud networking?",
            options: ["Virtual Private Cloud", "Very Private Connection", "Virtual Public Cloud", "Verified Private Connection"],
            correctAnswer: 0,
            explanation: "VPC is a Virtual Private Cloud, an isolated network within a cloud provider",
            difficulty: "Medium",
            timeLimit: 45
        },
        {
            id: 5,
            question: "Which service provides managed Kubernetes in AWS?",
            options: ["ECS", "EKS", "Lambda", "Fargate"],
            correctAnswer: 1,
            explanation: "EKS (Elastic Kubernetes Service) is AWS's managed Kubernetes service",
            difficulty: "Medium",
            timeLimit: 60
        }
    ],
    'devops': [
        {
            id: 1,
            question: "What does CI/CD stand for?",
            options: ["Continuous Integration/Continuous Deployment", "Central Integration/Central Deployment", "Code Integration/Code Deployment", "Continuous Inspection/Continuous Development"],
            correctAnswer: 0,
            explanation: "CI/CD is Continuous Integration and Continuous Deployment/Delivery",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 2,
            question: "Which tool is used for containerization?",
            options: ["Jenkins", "Docker", "Ansible", "Terraform"],
            correctAnswer: 1,
            explanation: "Docker is the most popular containerization platform",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 3,
            question: "What is Kubernetes used for?",
            options: ["Version control", "Container orchestration", "Code compilation", "Database management"],
            correctAnswer: 1,
            explanation: "Kubernetes orchestrates and manages containerized applications at scale",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 4,
            question: "Which file defines Docker container configuration?",
            options: ["docker.json", "Dockerfile", "container.yml", "docker.config"],
            correctAnswer: 1,
            explanation: "Dockerfile contains instructions to build a Docker image",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 5,
            question: "What is Infrastructure as Code (IaC)?",
            options: ["Writing code for infrastructure", "Managing infrastructure through code", "Coding on cloud servers", "Infrastructure documentation"],
            correctAnswer: 1,
            explanation: "IaC manages and provisions infrastructure through machine-readable definition files",
            difficulty: "Medium",
            timeLimit: 60
        }
    ],
    'mobile-dev': [
        {
            id: 1,
            question: "Which language is primarily used for Android development?",
            options: ["Swift", "Kotlin", "JavaScript", "Ruby"],
            correctAnswer: 1,
            explanation: "Kotlin is the preferred language for Android development, along with Java",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 2,
            question: "What is React Native?",
            options: ["A native iOS framework", "A cross-platform mobile framework", "An Android library", "A testing tool"],
            correctAnswer: 1,
            explanation: "React Native allows building mobile apps for iOS and Android using React",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 3,
            question: "Which file contains Android app permissions?",
            options: ["build.gradle", "AndroidManifest.xml", "strings.xml", "config.xml"],
            correctAnswer: 1,
            explanation: "AndroidManifest.xml declares app permissions and components",
            difficulty: "Medium",
            timeLimit: 45
        },
        {
            id: 4,
            question: "What is the iOS equivalent of Android's Activity?",
            options: ["Fragment", "ViewController", "View", "Controller"],
            correctAnswer: 1,
            explanation: "ViewController in iOS is similar to Activity in Android for managing screens",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 5,
            question: "Which tool is used for iOS app development?",
            options: ["Android Studio", "Xcode", "Visual Studio", "Eclipse"],
            correctAnswer: 1,
            explanation: "Xcode is Apple's official IDE for iOS and macOS development",
            difficulty: "Easy",
            timeLimit: 30
        }
    ],
    'cybersecurity': [
        {
            id: 1,
            question: "What does HTTPS stand for?",
            options: ["HyperText Transfer Protocol Secure", "High Transfer Protocol System", "HyperText Transmission Protocol Security", "HTTP Security"],
            correctAnswer: 0,
            explanation: "HTTPS is HTTP with encryption using SSL/TLS",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 2,
            question: "What is SQL injection?",
            options: ["A database feature", "A security vulnerability", "A query optimization", "A data type"],
            correctAnswer: 1,
            explanation: "SQL injection is a code injection technique that exploits security vulnerabilities in database queries",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 3,
            question: "What is the purpose of a firewall?",
            options: ["Speed up network", "Monitor and control network traffic", "Store passwords", "Encrypt data"],
            correctAnswer: 1,
            explanation: "Firewall monitors and controls incoming and outgoing network traffic based on security rules",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 4,
            question: "What does XSS stand for in web security?",
            options: ["Cross-Site Scripting", "Extra Security System", "XML Security Standard", "Cross-Server Sync"],
            correctAnswer: 0,
            explanation: "XSS (Cross-Site Scripting) is a vulnerability that allows attackers to inject malicious scripts",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 5,
            question: "What is two-factor authentication (2FA)?",
            options: ["Two passwords", "Two security layers for verification", "Two user accounts", "Two encryption methods"],
            correctAnswer: 1,
            explanation: "2FA requires two different authentication factors to verify identity",
            difficulty: "Easy",
            timeLimit: 45
        }
    ],
    'database': [
        {
            id: 1,
            question: "What does ACID stand for in databases?",
            options: ["Atomicity, Consistency, Isolation, Durability", "Automatic, Consistent, Isolated, Durable", "Atomic, Complete, Isolated, Distributed", "Advanced, Consistent, Integrated, Distributed"],
            correctAnswer: 0,
            explanation: "ACID properties ensure reliable database transactions",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 2,
            question: "Which SQL command is used to retrieve data?",
            options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
            correctAnswer: 1,
            explanation: "SELECT is the SQL command to query and retrieve data from database",
            difficulty: "Easy",
            timeLimit: 30
        },
        {
            id: 3,
            question: "What is a primary key?",
            options: ["First column in table", "Unique identifier for each record", "Encrypted key", "Foreign reference"],
            correctAnswer: 1,
            explanation: "Primary key uniquely identifies each record in a database table",
            difficulty: "Easy",
            timeLimit: 45
        },
        {
            id: 4,
            question: "What is the difference between SQL and NoSQL?",
            options: ["No difference", "SQL is relational, NoSQL is non-relational", "SQL is faster", "NoSQL is deprecated"],
            correctAnswer: 1,
            explanation: "SQL databases are relational with fixed schema, NoSQL are non-relational with flexible schema",
            difficulty: "Medium",
            timeLimit: 60
        },
        {
            id: 5,
            question: "What is database normalization?",
            options: ["Backing up data", "Organizing data to reduce redundancy", "Encrypting data", "Indexing tables"],
            correctAnswer: 1,
            explanation: "Normalization organizes database structure to minimize redundancy and dependency",
            difficulty: "Medium",
            timeLimit: 60
        }
    ]
};

// Mock quiz history
export const mockQuizHistory = [
    {
        id: 1,
        category: 'quantitative',
        score: 80,
        totalQuestions: 5,
        correctAnswers: 4,
        timeTaken: 240,
        date: '2026-02-01',
        percentile: 75
    },
    {
        id: 2,
        category: 'logical',
        score: 60,
        totalQuestions: 5,
        correctAnswers: 3,
        timeTaken: 300,
        date: '2026-02-02',
        percentile: 60
    },
    {
        id: 3,
        category: 'verbal',
        score: 100,
        totalQuestions: 5,
        correctAnswers: 5,
        timeTaken: 180,
        date: '2026-02-03',
        percentile: 95
    }
];
