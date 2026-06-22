export interface Question {
  id: string;
  type: 'TECHNICAL' | 'NON_TECHNICAL' | 'DEBUG';
  title: string;
  description: string;
  // Multiple choice
  options?: string[];
  correctAnswer?: string;
  // Debug
  initialCode?: string;
  correctCodeSnippet?: string;
}

export interface Chapter {
  id: number;
  title: string;
  gatewayPuzzle: {
    clue: string;
    hint: string;
    answer: string;
  };
  videoUrl: string;
  questions: Question[];
}

export const chaptersData: Record<number, Chapter> = {
  1: {
    id: 1,
    title: "Chapter 1: The Breach",
    gatewayPuzzle: {
      clue: "DECRYPT: 26 - 19 - 19 - 03 - 08",
      hint: "A = 1, B = 2...",
      answer: "ZSSCH" 
    },
    videoUrl: "https://www.youtube.com/watch?v=M7FIvfx5J10", // Matrix style intro
    questions: [
      {
        id: "1-tech",
        type: 'TECHNICAL',
        title: "Suspicious ARP Log",
        description: "A suspicious ARP log was captured during the fest. Study it and identify which device is the imposter.\n[ARP LOG - 22:47:13]\n192.168.1.99 → BROADCAST  \"Who has 192.168.1.50? Tell 192.168.1.99\"\n192.168.1.99 → ALL        \"192.168.1.50 is at AA:BB:CC:DD:EE:FF\"\n192.168.1.1  → 192.168.1.50  [Traffic now rerouted]\n\nDevice table:\n  .1    = Campus router      (known)\n  .50   = Dean's laptop      (known)\n  .99   = ???                (unknown device)",
        options: ["192.168.1.1", "192.168.1.50", "192.168.1.99", "AA:BB:CC:DD:EE:FF"],
        correctAnswer: "192.168.1.99"
      },
      {
        id: "1-nontech",
        type: 'NON_TECHNICAL',
        title: "Vulnerability Analysis",
        description: "[NETWORK INTELLIGENCE] VULNERABILITY ANALYSIS:\nThe Void left this message on the hacked projector screen. What network vulnerability does it point to?\n\"We entered through a door that everyone uses but nobody ever locks. It had a welcome mat, no key required.\"",
        options: ["Default Credentials", "SQL Injection", "Buffer Overflow", "Phishing"],
        correctAnswer: "Default Credentials"
      },
      {
        id: "1-debug",
        type: 'DEBUG',
        title: "Network Scanner Bug",
        description: "Your teammate wrote a Python script to find all devices on the subnet. It crashes before scanning a single IP. Tell us what the bug is.",
        initialCode: "import socket\n\ndef scan_network(subnet):\n    devices = []\n    for i in range(1, 256)\n        ip = subnet + str(i)\n        try:\n            socket.setdefaulttimeout(0.5)\n            socket.gethostbyaddr(ip)\n            devices.append(ip)\n        except:\n            pass\n    return devices\n\nprint(scan_network(\"192.168.1.\"))",
        correctCodeSnippet: ":" 
      }
    ]
  },
  2: {
    id: 2,
    title: "Chapter 2: The Deep Web",
    gatewayPuzzle: {
      clue: "CONVERT BINARY TO DECIMAL TO WORD (MESSAGE WILL BE HIDDEN)\n01010011 01001011\n01000011 01000101 01010100",
      hint: "Translate the binary to text.",
      answer: "SKCET" 
    },
    videoUrl: "https://www.youtube.com/watch?v=bT3O7Mh_rUo", // Cyberpunk vibe
    questions: [
      {
        id: "2-tech",
        type: 'TECHNICAL',
        title: "Secure Gateway",
        description: "Identify the correct secure gateway to halt the remaining destructive processes.",
        options: ["https://skcet.ac.in", "http://skcet.ac.in", "skcet.xyz"],
        correctAnswer: "https://skcet.ac.in"
      },
      {
        id: "2-nontech",
        type: 'NON_TECHNICAL',
        title: "Binary Pixel Transmission",
        description: "The Void left this binary pixel transmission. Identify the hidden word.\n\n11111 01110 11110 01110  11110 01110 10001\n00001 10000 10001 10001  10001 10001 10001\n00010 10000 10001 10001  10001 10001 10001\n00100 11111 11110 10001  10001 11111 01010\n01000 10000 10100 10001  10001 10001 00100\n10000 10000 10010 10001  10001 10001 00100\n11111 11111 10001 01110  11110 10001 00100",
        correctAnswer: "ZERO"
      },
      {
        id: "2-debug",
        type: 'DEBUG',
        title: "Predict the Output",
        description: "Predict the output of count after the loop ends.",
        initialCode: "int count = 0;\nfor (int i = 0; i < 10; i++) {\n    if (i % 2 != 0) {\n        count++;\n    }\n}\n// What is count?",
        correctCodeSnippet: "5"
      }
    ]
  },
  3: {
    id: 3,
    title: "Chapter 3: The Firewall",
    gatewayPuzzle: {
      clue: "CONVERT Hex TO DECIMAL TO WORD (MESSAGE WILL BE HIDDEN)\n10 08 01 0E 14 0F 0D",
      hint: "Convert hex to letter position.",
      answer: "PHANTOM"
    },
    videoUrl: "https://www.youtube.com/watch?v=W0LHTWG-UmQ", 
    questions: [
      {
        id: "3-tech",
        type: 'TECHNICAL',
        title: "Red Flags in Email",
        description: "Select the combination that contains THREE red flags in this email:\n\n▶From: admin@skcet.ac.in\nReply-To: harvester99@protonmail.com\nX-Originating-IP: 45.33.32.156\nReceived: from mail. totally-legit-uni. xyz\nDKIM-Signature: FAIL\nSPF: FAIL\nSubject: URGENT - Verify your credentials now",
        options: ["Reply-To address, DKIM/SPF FAIL, Received domain", "From address, Subject URGENT, X-Originating-IP"],
        correctAnswer: "Reply-To address, DKIM/SPF FAIL, Received domain"
      },
      {
        id: "3-nontech",
        type: 'NON_TECHNICAL',
        title: "Morse Code",
        description: "... .... .- -.. --- .--",
        correctAnswer: "SHADOW"
      },
      {
        id: "3-debug",
        type: 'DEBUG',
        title: "Predict the Output",
        description: "Predict the output of the code.",
        initialCode: "for(int i=0;i<5;i++)\n{\n    if(i==3)\n        break;\n\n    System.out.print(i);\n}",
        correctCodeSnippet: "012"
      }
    ]
  },
  4: {
    id: 4,
    title: "Chapter 4: The Mainframe",
    gatewayPuzzle: {
      clue: "An attacker's message was intercepted encrypted with a Caesar cipher. Use the dial below to shift the letters and find the plaintext. The correct shift will reveal a meaningful sentence.\n\nCIPHERTEXT: DWWDFN DW GDZQ",
      hint: "Caesar shift by 3 backwards.",
      answer: "ATTACK AT DAWN" 
    },
    videoUrl: "https://www.youtube.com/watch?v=3W2XqK1Z_dE",
    questions: [
      {
        id: "4-tech",
        type: 'TECHNICAL',
        title: "Attack Sequence",
        description: "Arrange the fragments in the correct order to reconstruct the attack sequence:\n\nif time == 3:\nactivate(logic_bomb)\ndelete(exam_database)\nsend_alert()\nbackup_records()",
        options: [
          "if time == 3:\n    activate(logic_bomb)\n    delete(exam_database)", 
          "backup_records()\nif time == 3:\n    activate(logic_bomb)", 
          "send_alert()\ndelete(exam_database)"
        ],
        correctAnswer: "if time == 3:\n    activate(logic_bomb)\n    delete(exam_database)"
      },
      {
        id: "4-nontech",
        type: 'NON_TECHNICAL',
        title: "Code Word Image",
        description: "Find the Code Word from the Image. (Image is corrupted, try analyzing the metadata of the previous files to guess the word)",
        correctAnswer: "MALWARE"
      },
      {
        id: "4-debug",
        type: 'DEBUG',
        title: "Predict the Output",
        description: "Predict the output of the array sum code.",
        initialCode: "int[] arr = {2, 4, 6, 8};\n\nint sum = 0;\n\nfor(int i = 0; i < arr.length; i++)\n{\n    sum += arr[i];\n}\n\nSystem.out.println(sum);",
        correctCodeSnippet: "20"
      }
    ]
  },
  5: {
    id: 5,
    title: "Chapter 5: The Core",
    gatewayPuzzle: {
      clue: "Till Now the collected fragment from previous chapter unlock the 5th Chapter 'We will get D-I-O-V rearrange it to get the Word'.(Twist)",
      hint: "Rearrange the letters.",
      answer: "VOID" 
    },
    videoUrl: "https://www.youtube.com/watch?v=O5b0ExNgqwQ",
    questions: [
      {
        id: "5-tech",
        type: 'DEBUG',
        title: "Decrypt Array",
        description: "Fix the Code to find the word 'ZERO'.",
        initialCode: "public class Main {\n    public static void main(String[] args) {\n\n        int[] clue = {95, 74, 87, 84};\n\n        for(int i = 0; i < clue.length; i++) {\n            int n = clue[i] - 7;\n            char decoded = (char)(n);\n            System.out.print(decoded);\n        }\n    }\n}",
        correctCodeSnippet: "clue[i] - 5"
      },
      {
        id: "5-nontech",
        type: 'NON_TECHNICAL',
        title: "Braille Decode",
        description: "BRAILLE DECODE\n● ○   ● ○   ● ●   ● ○\n● ●   ○ ○   ○ ○   ○ ○\n○ ○   ○ ○   ○ ○   ● ○",
        correctAnswer: "HACK"
      },
      {
        id: "5-debug",
        type: 'DEBUG',
        title: "Predict the Output",
        description: "Predict the output of the fibonacci logic.",
        initialCode: "public class Main {\n    public static void main(String[] args) {\n\n        int n = 5;\n\n        int a = 1, b = 1, c = 1;\n\n        for(int i = 2; i <= n; i++) {\n            c = a + b;\n            a = b;\n            b = c;\n        }\n\n        System.out.println(c);\n    }\n}",
        correctCodeSnippet: "8"
      }
    ]
  }
};
