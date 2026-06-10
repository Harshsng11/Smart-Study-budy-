import { SubjectData } from './types';

export const SUBJECTS_DATABASE: SubjectData[] = [
  {
    id: 'dbms',
    name: 'Database Management Systems',
    code: 'TCS-401',
    description: 'Relational data models, SQL queries, transactional properties, normal forms, and secure indices.',
    semester: '4th Semester',
    summaries: [
      {
        unitNumber: 1,
        unitTitle: 'Introduction & Entity-Relationship Modeling',
        summaryText: 'Introduces database concepts, structural constraints, and ER design. ER models visually represent real-world objects (entities) and interactions (relationships) as logical blueprints before database creation.',
        keyTerms: [
          { term: 'Schema', definition: 'The overall logical structure and shape of the database system, rarely modified.' },
          { term: 'Cardinality', definition: 'The ratio showing how many entities on one side relate to entities on the other side (e.g. 1-to-many).' }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Relational Model & Relational Algebra',
        summaryText: 'Focuses on structural elements like tables (relations), tuple constraints, and algebraic operators such as Projection (π), Selection (σ), Joins (⋈), and Cartesians used to extract query results mathematically.',
        keyTerms: [
          { term: 'Referential Integrity', definition: 'Ensures foreign key values must strictly exist in the parent table or be NULL.' },
          { term: 'Candidate Key', definition: 'The minimal set of attributes capable of uniquely identifying every database record.' }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'Relational Database Design & Normalization',
        summaryText: 'Reduces data redundancy and prevents insertion, deletion, and update anomalies. It systematic separates attributes into specialized tables using functional dependencies (FDs) through structured rules like 1NF, 2NF, 3NF, and BCNF.',
        keyTerms: [
          { term: 'Functional Dependency', definition: 'A constraint where value A uniquely controls or determines the value of B written as A -> B.' },
          { term: 'BCNF', definition: 'Boyce-Codd Normal Form. Strict normal form requiring every determinant attribute to be a superkey.' }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'Transaction Processing & Concurrency Control',
        summaryText: 'Coordinates simultaneous transactional requests. Concurrency algorithms (like Two-Phase Locking and Timestamp Ordering) protect data execution against overlapping writes to guarantee full ACID safety.',
        keyTerms: [
          { term: 'ACID Properties', definition: 'The fundamental requirements of transactions: Atomicity, Consistency, Isolation, and Durability.' },
          { term: 'Dirty Read', definition: 'An anomaly where transaction A reads updated database rows before transaction B officially commits the change.' }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'Indexing, Storage & File Structures',
        summaryText: 'Analyzes hardware storage organizations, dense/sparse file organizations, and modern tree-based indexes including B-Trees and B+ Trees that accelerate search operations to logarithmic time.',
        keyTerms: [
          { term: 'B+ Tree', definition: 'A balanced search tree where all data rows are located strictly at leaf nodes connected via linked pointers.' },
          { term: 'Dense Index', definition: 'An indexed storage where every single key value in the database records has a corresponding index record pointing to its offset.' }
        ]
      }
    ],
    topics: [
      {
        id: 'dbms-t1',
        title: 'ACID Properties in Transactions',
        importance: 'Critical',
        concept: 'Guarantees transaction reliability in multi-user databases.',
        explanation: 'ACID represents four pillars:\n1. Atomicity: "All or nothing" execution. If any operation fails, the entire transaction is reverted.\n2. Consistency: Moves the database state from one valid semantic condition to another.\n3. Isolation: Simultaneous transactions run in deep quarantine, hiding their intermediate updates from each other.\n4. Durability: Once a transaction is committed, its effects are locked in non-volatile storage, surviving crashes.',
        keyPoints: [
          'Atomicity is managed by the Transaction Manager using WAL (Write-Ahead Logging).',
          'Isolation levels influence read phenomenon: Dirty Read, Non-repeatable Read, and Phantom Read.',
          'Durability is maintained through recovery logs and constant checkpoint writing.'
        ]
      },
      {
        id: 'dbms-t2',
        title: 'Database Normalization Levels (1NF to BCNF)',
        importance: 'Critical',
        concept: 'Eliminating relational anomalies through structured decomposition.',
        explanation: 'Normalization rearranges attributes to delete redundant duplicates:\n- 1NF: Atoms only. Cells must not contain composite values, arrays, or repeating lists.\n- 2NF: Must be 1NF + has zero "partial dependencies" (where a non-key column relies on only a piece of a multi-column primary key).\n- 3NF: Must be 2NF + has zero "transitive dependencies" (where non-key column A relies on non-key B, which relies on the primary key).\n- BCNF: Stronger than 3NF. For every FD "X -> Y", X must be a superkey.',
        keyPoints: [
          'Normalization trades off search speed to secure storage integrity and atomic writes.',
          'BCNF may not always preserve functional dependencies during table division, while 3NF always does.',
          'Over-normalizing causes too many expensive SQL JOIN operations, prompting structural denormalization in Read-Heavy designs like Warehouses.'
        ]
      },
      {
        id: 'dbms-t3',
        title: 'Two-Phase Locking Protocol (2PL)',
        importance: 'High',
        concept: 'A state protocol securing conflict serializability.',
        explanation: '2PL ensures transactional sequences are serializable by strictly separating lock requests into two distinct phases:\n- Growing Phase: Transactions acquire read/write locks but cannot release any.\n- Shrinking Phase: Transactions release locked items but are blocked from acquiring new ones.',
        keyPoints: [
          'Guarantees conflict serializability but does not guard against deadlocks (both transactions could wait for flags locked by each other).',
          'Strict 2PL limits releases until the exact instant of Commit/Abort to prevent cascading aborts.'
        ]
      }
    ],
    vivaQuestions: [
      {
        id: 'dbms-v1',
        question: 'What is the absolute difference between B-Trees and B+ Trees in SQL indexing?',
        answer: 'In B-Trees, both keys and actual data records can be stored inside interior and leaf nodes. In B+ Trees, interior nodes store only index keys for navigation, while the actual data points are completely stored inside the leaf nodes. Additionally, sibling leaf nodes in B+ Trees are linked sequentially, supporting lightning-fast range scans directly.',
        hint: 'Think about leaves holding range links.',
        category: 'Indexing'
      },
      {
        id: 'dbms-v2',
        question: 'Explain what a Phantom Read is, and identify the Isolation Level that completely blocks it.',
        answer: 'A Phantom Read happens when Transaction A executes a range query (e.g., balance > 500) and gets a set of rows, then Transaction B inserts a new matching row and commits. If Transaction A re-runs the range query, it sees a "phantom" row. It is completely blocked by the "Serializable" Isolation level.',
        hint: 'Range search returns a different row count on a second read.',
        category: 'Concurrency'
      },
      {
        id: 'dbms-v3',
        question: 'How do you check if a split database schema preserves dependencies?',
        answer: 'If the union of functional dependencies of the decomposed tables is equivalent to the original functional dependencies, then the decomposition is dependency-preserving.',
        hint: 'Run a closure check on each split dependency.',
        category: 'Normalization'
      }
    ],
    quizQuestions: [
      {
        id: 'dbms-q1',
        question: 'Which component of a database system is strictly responsible for managing transaction rollback during crashes?',
        options: [
          'Buffer Queue Module',
          'Recovery Manager / Log Manager',
          'Query Parser',
          'Authorization Controller'
        ],
        correctIndex: 1,
        explanation: 'The Recovery Manager uses recovery checkpoints and Write-Ahead Logging (WAL) to undo uncommitted actions and redo committed ones following severe crashes.'
      },
      {
        id: 'dbms-q2',
        question: 'If attribute relation X functionally determines Y (X -> Y), and Y determines Z (Y -> Z), which normalization level is violated if X is the primary key and Y is a non-prime attribute?',
        options: [
          'First Normal Form (1NF)',
          'Second Normal Form (2NF)',
          'Third Normal Form (3NF)',
          'Boyce-Codd Normal Form only'
        ],
        correctIndex: 2,
        explanation: 'This illustrates a transitive dependency (X -> Y -> Z) where a non-prime attribute (Z) indirectly depends on the primary key (X) through another non-prime attribute (Y). This directly violates Third Normal Form (3NF) requirements.'
      },
      {
        id: 'dbms-q3',
        question: 'What is the primary operational complexity advantage of indexing a table with a B+ Tree instead of a standard hash index?',
        options: [
          'O(1) search for exact individual key matchups',
          'Fast matching for wildcards and range scan queries (e.g. BETWEEN 20 AND 50)',
          'Complete exclusion of primary keys',
          'No disk block storage requirements'
        ],
        correctIndex: 1,
        explanation: 'B+ Trees store their sequential values next to each other in leaf nodes, allowing O(log N) range scans across sibling pointers. Hash indices only support fast O(1) exact match checks and cannot optimize range sweeps.'
      }
    ]
  },
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'TCS-402',
    description: 'Kernel architectures, multiprogramming concepts, scheduling processes, memory paging, and deadlock safety designs.',
    semester: '4th Semester',
    summaries: [
      {
        unitNumber: 1,
        unitTitle: 'Introduction & Structure of OS',
        summaryText: 'Covers the transition between User Mode and Kernel Mode via software interrupts (System Calls). Examines monolithic, microkernel, and hybrid kernel layers managing hardware resource virtualization.',
        keyTerms: [
          { term: 'Kernel Mode', definition: 'The highest privilege system ring where CPU executing directly handles physical memory and hardware peripherals.' },
          { term: 'System Call', definition: 'The programmatic pathway interface that user programs execute to request guarded services from the OS kernel.' }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Process Management & Threads',
        summaryText: 'Reviews process status states from creation to termination. Compares heavyweight process execution blocks against lightweight threads sharing code/data heap spaces, and details task context switching steps.',
        keyTerms: [
          { term: 'PCB', definition: 'Process Control Block. A kernel-level structure tracking PID, CPU register backups, and file lock pointers for a process.' },
          { term: 'Context Switch', definition: 'Save context of a CPU process and restore the state of another to share active execution.' }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'CPU Scheduling Algorithms',
        summaryText: 'Determines the optimal sequence to load ready tasks onto the core. Computes performance metrics (Waiting, Turnaround, Response) applying algorithms like SJF, Preemptive Priority, and Round Robin.',
        keyTerms: [
          { term: 'Convoy Effect', definition: 'A performance drag where tiny processes wait in long queues behind a bulky, CPU-intensive process in FCFS.' },
          { term: 'Time Quantum', definition: 'A small runtime slot (e.g., 10-100ms) assigned to tasks in Round Robin scheduling before preemption occurs.' }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'Memory Management & Virtual Memory',
        summaryText: 'Creates physical isolation and virtual expansion via page-table frames. Translates virtual CPU addresses using cache translation lookaside buffers (TLBs) and manages page-fault page swaps (LRU, FIFO).',
        keyTerms: [
          { term: 'Thrashing', definition: 'A critical crash state where an operating system spends more active work swapping pages in/out of swap storage than executing operations.' },
          { term: 'Belady\'s Anomaly', definition: 'A phenomenon where adding more physical page frames unexpectedly increases page faults under FIFO replacement.' }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'Deadlocks, Synchronizations, & File Systems',
        summaryText: 'Covers resource racing issues in IPC. Employs semaphores, locks, and monitors to secure Critical Sections. Teaches Resource Allocation Graphs and mathematical deadlock checks.',
        keyTerms: [
          { term: 'Critical Section', definition: 'A protected segment of code accessing shared variables that must not be accessed by more than one process at an instant.' },
          { term: 'Mutex', definition: 'A locking object that a process takes ownership of to restrict exclusive resource access.' }
        ]
      }
    ],
    topics: [
      {
        id: 'os-t1',
        title: 'CPU Scheduling Trade-offs (FCFS, Priority, Round Robin)',
        importance: 'Critical',
        concept: 'Evaluating core scheduling efficiency algorithms.',
        explanation: 'Each scheduling design targets specific metrics:\n- Shortest Job First (SJF): Yields mathematically optimal average waiting times but causes starvation for large files.\n- Round Robin (RR): Highly interactive, depends on carefully setting the Time Quantum. Setting it too high mimics slow FCFS; setting it too low wastes CPU clock cycle budgets on endless context switches.\n- Preemptive Priority: Runs tasks by priority ranks, risking starvation which is mitigated by aging.',
        keyPoints: [
          'Preemption is the active interrupting of a running task without its consent to hand execution directly to another.',
          'Starvation is resolved by "Aging" which gradually scales up a waiting task\'s priority based on its queue wait time.'
        ]
      },
      {
        id: 'os-t2',
        title: 'Deadlock Characterization & The Banker\'s Algorithm',
        importance: 'Critical',
        concept: 'Maintaining safe states to protect systems against permanent stalls.',
        explanation: 'A Deadlock occurs only when Coffman\'s four criteria are met:\n1. Mutual Exclusion: At least one resource is held in non-shareable mode.\n2. Hold and Wait: A process holds resources while waiting for another locked asset.\n3. No Preemption: Resources cannot be forcibly stripped from a running task.\n4. Circular Wait: Process A waits for B, B waits for C, and C waits for A.\n\nThe Bankers Algorithm prevents deadlocks. When a process requests resources, the OS evaluates if allocating them leaves the system in a "Safe State" where a sequence of tasks can still complete.',
        keyPoints: [
          'The Bankers Algorithm is a multi-resource deadlock avoidance tool using Max, Claim, and Available matrices.',
          'Safe State guarantees a system will not deadlock. Unsafe state represents a path that might slip into deadlock depending on process releases.'
        ]
      },
      {
        id: 'os-t3',
        title: 'Virtual Paging and Page Faults',
        importance: 'High',
        concept: 'Expanding logical RAM capacity using secondary disk blocks.',
        explanation: 'Programs execute inside a continuous virtual space. Memory is divided into fixed Logical Pages, and physical RAM is split into Page Frames. When the CPU references a page not currently map-loaded in RAM, a Page Fault exception triggers. The OS suspends execution, requests the page from disk, and maps it in an empty frame.',
        keyPoints: [
          'The Translation Lookaside Buffer (TLB) acts as a high-speed CPU cache for page-translation checks.',
          'LRU (Least Recently Used) tracks system access timestamps to prune stale pages during replacements.'
        ]
      }
    ],
    vivaQuestions: [
      {
        id: 'os-v1',
        question: 'Explain the architectural difference between a Microkernel and Monolithic Kernel.',
        answer: 'In monolithic designs, all key OS modules (file systems, device drivers, network stacks) run together in Kernel Space, offering peak execution speed at the cost of vulnerability (one driver crash brings down everything). In microkernels, only vital features run in Kernel Space; other sub-systems run in User Space as external services, coordinating via slower Message Passing but offering high reliability.',
        hint: 'Think about space isolation vs execution speed.',
        category: 'Kernel'
      },
      {
        id: 'os-v2',
        question: 'What is a Semaphore? Differentiate between Binary and Counting Semaphores.',
        answer: 'A semaphore is an integer variable accessed via atomic functions wait() (P) and signal() (V) that coordinates shared execution. A Binary Semaphore takes values 0 and 1 (acting like a Mutex). A Counting Semaphore takes unbound values to manage multiple units of a scarce pool of resources.',
        hint: 'An integer variable with atomic wait/signal controls.',
        category: 'Synchronization'
      },
      {
        id: 'os-v3',
        question: 'What is Thrashing, and how can the OS detect and prevent it?',
        answer: 'Thrashing occurs when logical allocations outstrip physical RAM, forcing memory managers to spend all CPU cycles swapping pages rather than executing user tasks. It is diagnosed when page fault rates spike towards 100%. Preventing it requires allocating working set spaces or pausing demanding processes using Page Fault Frequency bounds.',
        hint: 'CPU is fully busy moving pages rather than doing actual work.',
        category: 'Memory Management'
      }
    ],
    quizQuestions: [
      {
        id: 'os-q1',
        question: 'Which scheduling system is mathematically guaranteed to achieve the lowest average waiting time of any ready set?',
        options: [
          'First Come First Served (FCFS)',
          'Round Robin with 10ms Quantum limit',
          'Shortest Job First (SJF / SRTF)',
          'Multi-level Feedback Queue'
        ],
        correctIndex: 2,
        explanation: 'Shortest Job First (SJF) is mathematically optimal since executing short processes first reduces the wait times of subsequent tasks in the queue.'
      },
      {
        id: 'os-q2',
        question: 'Under which specific condition is Belady\'s Anomaly observed in virtual memory systems?',
        options: [
          'Under LRU caching as physical page frames are added',
          'Under FIFO replacement as physical page frame allocations increase',
          'Only when the page size is reduced to 512 bytes',
          'When Translation Lookaside Buffer (TLB) hits reach 100%'
        ],
        correctIndex: 1,
        explanation: 'Belady\'s Anomaly is a counter-intuitive behavior in First-In-First-Out (FIFO) paging where adding physical memory frames can increase page faults for resource-intensive loop paths.'
      },
      {
        id: 'os-q3',
        question: 'Which of the following describes the Hold and Wait condition required for deadlocks?',
        options: [
          'A resource can be held by only one process at a time',
          'A resource is stripped from a process before completion',
          'A process holds allocated resources while waiting for another resource occupied by a separate process',
          'Processes coordinate to share all files simultaneously'
        ],
        correctIndex: 2,
        explanation: 'Hold and Wait means that processes hold resources they already acquired while waiting to lock additional occupied resources.'
      }
    ]
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    code: 'TCS-403',
    description: 'Protocol architectures, OSI physical/logic layers, subnet masking, routing algorithms, and reliable flow transports.',
    semester: '4th Semester',
    summaries: [
      {
        unitNumber: 1,
        unitTitle: 'Physical Layer & Network Models',
        summaryText: 'Introduces physical cabling, signal encodings, bit rates, and topologies. Sets up the foundational layers of the ISO/OSI and TCP/IP reference stacks.',
        keyTerms: [
          { term: 'OSI Model', definition: 'The seven-layer standard: Physical, Data Link, Network, Transport, Session, Presentation, and Application.' },
          { term: 'Attenuation', definition: 'The loss of signal strength as physical energy travels over electrical or optical communication lines.' }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Data Link Layer & Local Protocols',
        summaryText: 'Protects links by arranging raw streams into discrete Frames. Controls medium collisions (CSMA/CD) and implements error and flow control.',
        keyTerms: [
          { term: 'CSMA/CD', definition: 'Carrier Sense Multiple Access with Collision Detection. Monitors cables for collisions before transmitting packets.' },
          { term: 'Sliding Window', definition: 'A sender-receiver frame system that dynamically limits unacknowledged payloads to prevent congestion.' }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'Network Layer & IP Routing',
        summaryText: 'Handles end-to-end packet delivery across remote boundaries. Manages classless IP subnet addressing and routing (Dijkstra/Link State vs Distance Vector).',
        keyTerms: [
          { term: 'CIDR Notation', definition: 'Classless Inter-Domain Routing tracking IP masks with bit numbers (e.g. 192.168.1.0/24).' },
          { term: 'Link State Routing', definition: 'A protocol where every gateway broadcasts its local topology map to establish a globally coordinated database.' }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'Transport Layer & TCP Protocols',
        summaryText: 'Maintains peer-to-peer data delivery. Compares connectionless UDP to connection-oriented TCP, demonstrating TCP flow control and congratulatory handshakes.',
        keyTerms: [
          { term: 'TCP 3-Way Handshake', definition: 'The connection-initiation sequence: SYN -> SYN-ACK -> ACK.' },
          { term: 'Congestion Window', definition: 'A sliding limit representing the volume of bytes a host can transmit before receiving feedback.' }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'Application Layer Services',
        summaryText: 'Provides network integration paths for application software. Details translation, file structures, and transfer mechanisms like DNS, HTTP, SSH, and client-server architectures.',
        keyTerms: [
          { term: 'DNS Server', definition: 'Domain Name System. A global lookup table translating human-readable web domains into numerical IP targets.' },
          { term: 'Stateless Protocol', definition: 'A transaction design where servers retain zero state configuration about past requests (e.g. HTTP).' }
        ]
      }
    ],
    topics: [
      {
        id: 'cn-t1',
        title: 'OSI 7-Layer Reference Model vs TCP/IP Stack',
        importance: 'Critical',
        concept: 'The standardized blueprints structuring modern packet architectures.',
        explanation: 'Network layers isolate communication details:\n- OSI Reference: Logical 7-layer layout (Application, Presentation, Session, Transport, Network, Data Link, Physical).\n- TCP/IP Stack: The practical protocol framework, mapping to 4 key slots:\n1. Application: Combines OSI Application, Presentation, and Session functions.\n2. Transport: Host-to-host delivery (TCP, UDP).\n3. Internet: Best-effort IP standard.\n4. Network Access: Physical framing and hardware interfaces.',
        keyPoints: [
          'Bridges and switches operate up to the Data Link Layer (Layer 2).',
          'Routers operate up to the Network Layer (Layer 3) to forward packets based on logical IP targets.'
        ]
      },
      {
        id: 'cn-t2',
        title: 'IP Addressing, Subnet Masks, & CIDR Calculations',
        importance: 'Critical',
        concept: 'Dividing networks into manageable broadcast areas.',
        explanation: 'IP Addresses are split into Network and Host portions using an overlay Subnet Mask.\n- Subnet Mask: A sequence of ones followed by zeros. The ones isolate the network address, while the zeros identify individual endpoints.\n- CIDR: Replaces Classful A/B/C ranges with dynamic mask limits (e.g., /26 matches mask 255.255.255.192), dividing 256 addresses into four subnets of 64 slots each.',
        keyPoints: [
          'The first address in a subnet represents the Network Identifier.',
          'The final address represents the Broadcast Target.',
          'Number of usable host slots is computed by formula: 2^(number of zero bits) - 2.'
        ]
      },
      {
        id: 'cn-t3',
        title: 'TCP Flow & Congestion Control Mechanisms',
        importance: 'High',
        concept: 'Protecting network pipelines from overload.',
        explanation: 'TCP uses flow and congestion control to manage delivery rates:\n- Flow Control: Keeps sender speeds aligned with the receiver\'s buffer limits using a dynamic Receiver Window (rwnd).\n- Congestion Control: Matches output speeds with network bandwidth limits using algorithms like Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.',
        keyPoints: [
          'Slow Start doubles the congestion window size (cwnd) each RTT until it hits ssthresh.',
          'Congestion Avoidance grows cwnd linearly (+1 MSS per RTT) upon crossing the threshold limit.'
        ]
      }
    ],
    vivaQuestions: [
      {
        id: 'cn-v1',
        question: 'Detail the difference between the TCP and UDP transport protocols.',
        answer: 'TCP is connection-oriented, providing reliable, in-sequence delivery using acknowledgments, flow controls, and congestive back-off, which introduces transmission overhead. UDP is lightweight and connectionless, sending packets without order guarantees or flow checks. This makes it ideal for real-time applications like audio/video streams.',
        hint: 'Connection-oriented reliability vs lightweight speed.',
        category: 'Transport'
      },
      {
        id: 'cn-v2',
        question: 'How do Distance Vector and Link State routing algorithms differ?',
        answer: 'In Distance Vector (e.g. RIP), routers share only their local vector distances with direct neighbors based on local calculations. In Link State routing (e.g., OSPF), every router broadcasts its local connectivity states to the entire network, allowing all nodes to build identical topologies to compute Dijkstra shortest-paths.',
        hint: 'Neighbors sharing vector lists vs everyone broadcasting local maps.',
        category: 'Network Routing'
      },
      {
        id: 'cn-v3',
        question: 'What is ARP, and where does it sit in routing?',
        answer: 'ARP (Address Resolution Protocol) translates a logical Network Layer IP address into a physical Data Link Layer MAC address to route frames locally on a shared wire.',
        hint: 'Resolves logical IP into local physical hardware MAC tags.',
        category: 'Resolving Addresses'
      }
    ],
    quizQuestions: [
      {
        id: 'cn-q1',
        question: 'What is the correct subnet mask for host range configuration using CIDR block code prefix /26?',
        options: [
          '255.255.255.0',
          '255.255.255.128',
          '255.255.255.192',
          '255.255.255.240'
        ],
        correctIndex: 2,
        explanation: 'A /26 mask contains 26 consecutive 1s: 24 in the first three octets, and two in the fourth (11000000 binary = 192 decimal), resulting in 255.255.255.192.'
      },
      {
        id: 'cn-q2',
        question: 'Which sequence correctly represents the SYN/ACK packets sent during a standard TCP connection teardown?',
        options: [
          'SYN -> SYN-ACK -> ACK',
          'FIN -> ACK -> FIN -> ACK',
          'FIN -> FIN-ACK -> ACK',
          'RST -> SYN -> ACK'
        ],
        correctIndex: 1,
        explanation: 'TCP teardown uses a four-step wave: FIN from sender, ACK acknowledgment from receiver, receiver FIN when its final operations complete, and client ACK acknowledgment.'
      },
      {
        id: 'cn-q3',
        question: 'Which network layer represents the highest tier of the TCP/IP conceptual architecture, grouping the Application, Presentation, and Session tiers of the 7-layer ISO/OSI blueprint?',
        options: [
          'Internet Layer',
          'Transport Layer',
          'Application Layer',
          'Session Controller Wrapper'
        ],
        correctIndex: 2,
        explanation: 'The TCP/IP stack simplifies design by grouping presentation, session synchronization, and custom message operations into a single Application Layer.'
      }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    code: 'TCS-301',
    description: 'Complexity metrics, linked arrays, trees, heaps, graph searches, sorting benchmarks, and dynamic programming.',
    semester: '3rd Semester',
    summaries: [
      {
        unitNumber: 1,
        unitTitle: 'Asymptotic Analysis & Base Structures',
        summaryText: 'Introduces complexity bounds (Big-O, Omega, Theta). Reviews memory allocation footprints of sequential arrays and linked lists.',
        keyTerms: [
          { term: 'Big-O Notation', definition: 'The upper bound showing worst-case computation growth bounds as inputs scale.' },
          { term: 'Doubly Linked List', definition: 'A chain where every node stores both value data and pointers to the immediate next and prior nodes.' }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Linear Stacks, Queues, & Recursions',
        summaryText: 'Covers sequential data management using LIFO inputs and FIFO queues (including circular and priority structures), and reviews recursion execution stacks.',
        keyTerms: [
          { term: 'LIFO Structure', definition: 'Last-In, First-Out. The operational constraint of stack variables.' },
          { term: 'Circular Queue', definition: 'A queue array where the final slot maps back to the initial one to optimize memory reuse.' }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'Hierarchical Trees and Balanced BSTs',
        summaryText: 'Details tree structures. Explores binary search trees (BST) and balanced heights (AVL Trees, Heap indexes) matching logarithmic lookups.',
        keyTerms: [
          { term: 'AVL Tree', definition: 'A self-balancing Binary Search Tree where node height differences are strictly locked to maximum 1.' },
          { term: 'Max-Heap', definition: 'A complete binary tree where parent node keys always equal or exceed child node keys.' }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'Graphs, Transversals & Minimum Spanning Trees',
        summaryText: 'Analyzes adjacent matrix and list graph bindings. Solves connectivity lookups (DFS, BFS), shortest routing (Dijkstra), and minimal wire meshes (Kruskal, Prim).',
        keyTerms: [
          { term: 'Adjacency List', definition: 'An array of linked lists representing graph vertex targets.' },
          { term: 'Dijkstra\'s Algorithm', definition: 'An edge-greedy search computing single-source shortest paths on positive graphs.' }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'Sorting, Searching, & Algorithm Paradigms',
        summaryText: 'Analyzes sorting algorithms (Quick Sort, Merge Sort) and evaluates problem-solving approaches, comparing Greedy methods with Dynamic Programming (Memoization).',
        keyTerms: [
          { term: 'Memoization', definition: 'An optimization indexing strategy that caches the results of overlapping recursive sub-problems to avoid redundant calculations.' },
          { term: 'Pivot Element', definition: 'The reference boundary selected by Quick Sort to partition unsorted arrays.' }
        ]
      }
    ],
    topics: [
      {
        id: 'dsa-t1',
        title: 'Time & Space Complexity Benchmarking (Big-O)',
        importance: 'Critical',
        concept: 'Measuring algorithmic execution efficiency as input sizes grow.',
        explanation: 'Asymptotic notation measures execution scaling:\n- O(1): Constant time (e.g. array index lookups).\n- O(log N): Logarithmic time, splitting the problem search space in half (e.g., Binary Search).\n- O(N): Linear execution, scanning items sequentially.\n- O(N log N): Linearithmic time, typical of optimal comparative sorts.\n- O(N^2): Quadratic execution (e.g. nested iteration loops).',
        keyPoints: [
          'Worst-case benchmarks define absolute upper limits, while Average-case shows typical application payloads.',
          'Auxiliary space measures additional temporary cache memory distinct from the primary input size.'
        ]
      },
      {
        id: 'dsa-t2',
        title: 'Divide & Conquer vs Dynamic Programming',
        importance: 'Critical',
        concept: 'Contrasting recursive problem-solving approaches.',
        explanation: 'These patterns handle problem breakdown in distinct ways:\n- Divide & Conquer: Recursively breaks a problem into independent sub-problems (e.g., Quick/Merge Sort). Since sub-problems do not overlap, they can be solved separately.\n- Dynamic Programming: Solves problems with overlapping recursive paths (e.g., Fibonacci, Knapsack). It stores intermediate calculations in tables (Memoization) to prevent redundant work.',
        keyPoints: [
          'Dynamic Programming relies on Optimal Substructure (where overall solutions leverage optimal sub-solutions).',
          'Tabulation is a bottom-up approach; Memoization is a top-down recursive strategy.'
        ]
      },
      {
        id: 'dsa-t3',
        title: 'Graph Minimization (Kruskal\'s vs Prim\'s)',
        importance: 'High',
        concept: 'Building minimal connecting tree tracks.',
        explanation: 'Both algorithms construct Minimum Spanning Trees (MST) but use different strategies:\n- Kruskal\'s Algorithm: An edge-greedy approach. It sorts all edges by weight and adds the shortest ones to the forest, resolving circular loops using Disjoint-Set Union-Find.\n- Prim\'s Algorithm: A vertex-greedy approach. It starts at a single node and expands the tree by adding the closest adjacent vertex.',
        keyPoints: [
          'Kruskal\'s runs faster on sparse graphs with few connections.',
          'Prim\'s is well-suited for dense graphs with dense adjacent matrices.'
        ]
      }
    ],
    vivaQuestions: [
      {
        id: 'dsa-v1',
        question: 'Why does Quick Sort have a worst-case complexity of O(N^2), and how can we prevent it?',
        answer: 'Quick Sort hits O(N^2) if the selected pivot partition splits inputs unevenly (e.g., picking the minimum or maximum element in an already sorted array). This can be prevented by selecting a randomized pivot or using the "Median-of-Three" heuristic.',
        hint: 'Poor pivot selection in sorted conditions causes deep skew.',
        category: 'Sorting'
      },
      {
        id: 'dsa-v2',
        question: 'Explain the working of Union-Find (Disjoint Set) in Kruskal\'s algorithm.',
        answer: 'Union-Find groups nodes into disjoint component sets. A find(x) lookup identifies the root representative of node x. When considering an edge (u, v), we check if find(u) === find(v). If they match, they belong to the same tree, meaning adding the edge creates a loop. If they differ, union(u, v) merges the sets.',
        hint: 'Checks if two nodes share the same root representative to prevent loops.',
        category: 'Graph Logic'
      },
      {
        id: 'dsa-v3',
        question: 'What is a Hash Collision, and how do Chaining and Open Addressing resolve it?',
        answer: 'A hash collision occurs when two distinct keys hash to the exact same array index. Chaining resolves this by storing colliding items in a linked list at that index. Open Addressing searches for adjacent empty slots in the master array using linear, quadratic, or double-hash checks.',
        hint: 'Two keys map to the same array index layout.',
        category: 'Hash Index'
      }
    ],
    quizQuestions: [
      {
        id: 'dsa-q1',
        question: 'What is the absolute average-case time complexity of searching a target node inside a balanced AVL Tree?',
        options: [
          'O(1)',
          'O(log N)',
          'O(N)',
          'O(N log N)'
        ],
        correctIndex: 1,
        explanation: 'AVL trees strictly balance node heights to within 1, guaranteeing logarithmic search heights of O(log N) for all lookup operations.'
      },
      {
        id: 'dsa-q2',
        question: 'Which graph traversal strategy uses a Queue (FIFO) to explore a topology level by level?',
        options: [
          'Depth-First Search (DFS)',
          'Post-order Traversal',
          'Breadth-First Search (BFS)',
          'In-order BST sweep'
        ],
        correctIndex: 2,
        explanation: 'Breadth-First Search (BFS) uses a queue to track frontier vertices, exploring all direct neighbors before moving to deeper levels.'
      },
      {
        id: 'dsa-q3',
        question: 'Which of the following sorting algorithms is stable and has a guaranteed worst-case time complexity of O(N log N)?',
        options: [
          'Quick Sort',
          'Merge Sort',
          'Selection Sort',
          'Bubble Sort'
        ],
        correctIndex: 1,
        explanation: 'Merge Sort guarantees O(N log N) worst-case scaling by dividing arrays in half and merging them. It also preserves the relative order of equal elements (stable).'
      }
    ]
  },
  {
    id: 'se',
    name: 'Software Engineering',
    code: 'TCS-404',
    description: 'SDLC models, requirement analysis, UML object modeling, structural testing methods, and COCOMO size metrics.',
    semester: '4th Semester',
    summaries: [
      {
        unitNumber: 1,
        unitTitle: 'Software Engineering & SDLC Models',
        summaryText: 'Reviews the software lifecycle, from requirements collection to deployment. Compares plans like Sequential Waterfall, iterative Spiral, and modern Scrum.',
        keyTerms: [
          { term: 'SDLC', definition: 'Software Development Life Cycle. Structured phases guiding software production.' },
          { term: 'Agile Model', definition: 'An iterative approach focused on continuous feedback, rapid releases, and flexible adjustments.' }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Software Requirement Engineering',
        summaryText: 'Details requirements collection, validation, and SRS design. Distinguishes functional features from systemic performance goals.',
        keyTerms: [
          { term: 'SRS', definition: 'Software Requirements Specification. The official contract documenting all requested system features.' },
          { term: 'Functional Requirement', definition: 'A specific action or service the software system must perform.' }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'System Analysis & Object-Oriented Design',
        summaryText: 'Focuses on architectural design and system relationships using UML diagrams (Static Classes, Use Cases, Sequential timelines).',
        keyTerms: [
          { term: 'UML', definition: 'Unified Modeling Language. A standardized notation to model software structures.' },
          { term: 'Cohesion', definition: 'The degree of focus and structural strength of responsibility within a single module.' }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'Testing Principles & Quality Assurance',
        summaryText: 'Examines debugging protocols, verifying logic paths with White-box methods and evaluating functional specifications with Black-box testing.',
        keyTerms: [
          { term: 'White-Box Testing', definition: 'Testing that validates code paths, loops, and conditions with full access to the source code.' },
          { term: 'Regression Testing', definition: 'Re-running testing pipelines to confirm modifications do not break existing features.' }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'Cost Estimation & Project Management',
        summaryText: 'Details cost estimation, project scheduling, and metric tracking. Explains the COCOMO scale and risk planning.',
        keyTerms: [
          { term: 'COCOMO', definition: 'Constructive Cost Model. Estimating development timelines and effort based on thousands of source lines (KLOC).' },
          { term: 'Gantt Chart', definition: 'A bar chart tracking project timelines and dependency paths.' }
        ]
      }
    ],
    topics: [
      {
        id: 'se-t1',
        title: 'SDLC Framework Comparison (Waterfall, Spiral, Agile)',
        importance: 'Critical',
        concept: 'Selecting delivery structures based on scope clarity.',
        explanation: 'SDLC frameworks match different project needs:\n- Linear Waterfall: Works best for projects with clear, fixed requirements. Requires completing each phase sequentially before starting the next.\n- Spiral Model: An iterative framework structured around Risk Analysis. Ideal for large, high-risk systems.\n- Agile/Scrum: An iterative format where work is divided into short Sprints (e.g., 2-4 weeks), adapting quickly to changing user demands.',
        keyPoints: [
          'Waterfall is prone to high risk since testing occurs only at the end of the timeline.',
          'Agile prioritizes working software over exhaustive documentation.'
        ]
      },
      {
        id: 'se-t2',
        title: 'Coupling vs Cohesion in Structural Design',
        importance: 'Critical',
        concept: 'Achieving high module independence in system architectures.',
        explanation: 'These metrics evaluate modular quality:\n- Cohesion (Internal): Measures how closely related the responsibilities of a single module are. Goal: High Cohesion, keeping each module focused on a single task.\n- Coupling (External): Measures the level of inter-dependency between modules. Goal: Low (Loose) Coupling, allowing changes to one module without breaking others.',
        keyPoints: [
          'The ultimate goal of software engineering is: High Cohesion + Loose Coupling.',
          'Tight coupling makes code rigid and difficult to refactor.'
        ]
      },
      {
        id: 'se-t3',
        title: 'COCOMO Estimation Model Dynamics',
        importance: 'High',
        concept: 'Computing project timelines based on source code size.',
        explanation: 'The Constructive Cost Model (COCOMO) estimates effort using empirical curves:\n1. Basic: Computes timeline variables directly from thousands of line metrics (KLOC).\n2. Intermediate: refines basic estimates using 15 cost factors (e.g., hardware constraints, developer experience).\n3. Detailed: Evaluates estimates for individual subsystems separately.',
        keyPoints: [
          'Projects are classified into three modes: Organic (simple, small teams), Semi-Detached (medium complexity), and Embedded (highly restricted, strict regulations).',
          'Effort is expressed in Person-Months (PM).'
        ]
      }
    ],
    vivaQuestions: [
      {
        id: 'se-v1',
        question: 'Describe Cyclomatic Complexity and detail how to calculate it from a Control Flow Graph (CFG).',
        answer: 'Cyclomatic Complexity measures the logical complexity of code by tracking the number of independent execution paths. It is calculated from a Control Flow Graph using the formulas: V(G) = E - V + 2 (where E is the number of edges and V is the number of vertices) or V(G) = P + 1 (where P is the number of decision predicates).',
        hint: 'Number of independent execution paths in code graph calculations.',
        category: 'Metrics'
      },
      {
        id: 'se-v2',
        question: 'Compare validation to verification in software testing terms.',
        answer: 'Verification confirms if the software aligns with the specifications: "Are we building the product right?". Validation confirms if the software meets the user\'s actual needs: "Are we building the right product?".',
        hint: 'Are we building the product right vs Are we building the right product.',
        category: 'Quality Assurance'
      },
      {
        id: 'se-v3',
        question: 'What is a Singleton Design Pattern, and when is it used?',
        answer: 'A Singleton Pattern restricts a class to a single active instance, providing a global access point to it. It is commonly used for managing shared resources like configuration files or database connection pools.',
        hint: 'Restricts instantiation to exactly one unique object.',
        category: 'Design'
      }
    ],
    quizQuestions: [
      {
        id: 'se-q1',
        question: 'Which lifecycle model is structured around Risk Analysis during iteration cycles?',
        options: [
          'Sequential Waterfall Model',
          'Boehm\'s Spiral Model',
          'Rational Unified Process (RUP)',
          'Agile Scrum'
        ],
        correctIndex: 1,
        explanation: 'Boehm\'s Spiral Model is risk-driven, requiring developers to evaluate and mitigate risks during each cycle.'
      },
      {
        id: 'se-q2',
        question: 'In object-oriented design, what is the design goal for cohesion and coupling values?',
        options: [
          'Low Cohesion and Low Coupling',
          'High Cohesion and High Coupling',
          'High Cohesion and Low Coupling',
          'Low Cohesion and High Coupling'
        ],
        correctIndex: 2,
        explanation: 'High Cohesion ensures modules remain focused on a single task, while Low (Loose) Coupling reduces module inter-dependencies, improving overall system stability.'
      },
      {
        id: 'se-q3',
        question: 'Which testing category evaluates code paths, conditional logic, and internal branches with full access to the source code?',
        options: [
          'Black-box Testing',
          'White-box Testing / Structural-logic Testing',
          'System Validation Trial',
          'User Acceptance Testing'
        ],
        correctIndex: 1,
        explanation: 'White-box testing validates internal programming structures, statement branches, and logical conditions directly.'
      }
    ]
  }
];
