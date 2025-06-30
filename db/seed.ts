#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedPassword,
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
      image: 'https://avatars.githubusercontent.com/u/2?v=4',
      role: 'USER',
    },
  });

  // Create problems
  const problem1 = await prisma.problem.upsert({
    where: { id: 'two-sum' },
    update: {},
    create: {
      id: 'two-sum',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'EASY',
      topic: 'ARRAYS',
      constraints: ['2 <= nums.length <= 104', '-109 <= nums[i] <= 109', '-109 <= target <= 109'],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      starterCode: {
        javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
        python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
        java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}'
      },
      solutionCode: {
        javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}',
        python: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
        java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}'
      },
      tags: ['Two Pointers', 'Hash Table'],
    },
  });

  const problem2 = await prisma.problem.upsert({
    where: { id: 'add-two-numbers' },
    update: {},
    create: {
      id: 'add-two-numbers',
      title: 'Add Two Numbers',
      description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
      difficulty: 'MEDIUM',
      topic: 'LINKED_LIST',
      constraints: ['The number of nodes in each linked list is in the range [1, 100]', '0 <= Node.val <= 9', 'It is guaranteed that the list represents a number that does not have leading zeros.'],
      examples: [
        {
          input: 'l1 = [2,4,3], l2 = [5,6,4]',
          output: '[7,0,8]',
          explanation: '342 + 465 = 807.'
        }
      ],
      starterCode: {
        javascript: 'function addTwoNumbers(l1, l2) {\n    // Your code here\n}',
        python: 'def add_two_numbers(l1, l2):\n    # Your code here\n    pass',
        java: 'class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        // Your code here\n    }\n}'
      },
      solutionCode: {
        javascript: 'function addTwoNumbers(l1, l2) {\n    let dummy = new ListNode(0);\n    let current = dummy;\n    let carry = 0;\n    \n    while (l1 || l2 || carry) {\n        let sum = carry;\n        if (l1) {\n            sum += l1.val;\n            l1 = l1.next;\n        }\n        if (l2) {\n            sum += l2.val;\n            l2 = l2.next;\n        }\n        \n        carry = Math.floor(sum / 10);\n        current.next = new ListNode(sum % 10);\n        current = current.next;\n    }\n    \n    return dummy.next;\n}',
        python: 'def add_two_numbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n    \n    while l1 or l2 or carry:\n        sum_val = carry\n        if l1:\n            sum_val += l1.val\n            l1 = l1.next\n        if l2:\n            sum_val += l2.val\n            l2 = l2.next\n        \n        carry = sum_val // 10\n        current.next = ListNode(sum_val % 10)\n        current = current.next\n    \n    return dummy.next',
        java: 'class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode current = dummy;\n        int carry = 0;\n        \n        while (l1 != null || l2 != null || carry != 0) {\n            int sum = carry;\n            if (l1 != null) {\n                sum += l1.val;\n                l1 = l1.next;\n            }\n            if (l2 != null) {\n                sum += l2.val;\n                l2 = l2.next;\n            }\n            \n            carry = sum / 10;\n            current.next = new ListNode(sum % 10);\n            current = current.next;\n        }\n        \n        return dummy.next;\n    }\n}'
      },
      tags: ['Linked List', 'Math', 'Recursion'],
    },
  });

  const problem3 = await prisma.problem.upsert({
    where: { id: 'valid-parentheses' },
    update: {},
    create: {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      difficulty: 'EASY',
      topic: 'STACK',
      constraints: ['1 <= s.length <= 104', 's consists of parentheses only \'()[]{}\''],
      examples: [
        {
          input: 's = "()"',
          output: 'true',
          explanation: 'Valid parentheses.'
        }
      ],
      starterCode: {
        javascript: 'function isValid(s) {\n    // Your code here\n}',
        python: 'def is_valid(s):\n    # Your code here\n    pass',
        java: 'class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}'
      },
      solutionCode: {
        javascript: 'function isValid(s) {\n    const stack = [];\n    const pairs = {\n        \')\': \'(\',\n        \'}\': \'{\',\n        \']\': \'[\'\n    };\n    \n    for (let char of s) {\n        if (char === \'(\' || char === \'{\' || char === \'[\') {\n            stack.push(char);\n        } else {\n            if (stack.length === 0 || stack.pop() !== pairs[char]) {\n                return false;\n            }\n        }\n    }\n    \n    return stack.length === 0;\n}',
        python: 'def is_valid(s):\n    stack = []\n    pairs = {\n        \')\': \'(\',\n        \'}\': \'{\',\n        \']\': \'[\'\n    }\n    \n    for char in s:\n        if char in \'({[\':\n            stack.append(char)\n        else:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    \n    return len(stack) == 0',
        java: 'class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        Map<Character, Character> pairs = Map.of(\n            \')\', \'(\',\n            \'}\', \'{\',\n            \']\', \'[\'\n        );\n        \n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'{\' || c == \'[\') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty() || stack.pop() != pairs.get(c)) {\n                    return false;\n                }\n            }\n        }\n        \n        return stack.isEmpty();\n    }\n}'
      },
      tags: ['Stack', 'String'],
    },
  });

  // Create contests
  const contest1 = await prisma.contest.upsert({
    where: { id: 'weekly-contest-124' },
    update: {},
    create: {
      id: 'weekly-contest-124',
      title: 'Weekly Contest #124',
      description: 'Weekly coding contest with 4 problems',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      isActive: true,
      maxParticipants: 1000,
      userId: user1.id,
    },
  });

  const contest2 = await prisma.contest.upsert({
    where: { id: 'algorithm-master' },
    update: {},
    create: {
      id: 'algorithm-master',
      title: 'Algorithm Master Challenge',
      description: 'Advanced algorithm competition',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
      isActive: false,
      maxParticipants: 500,
      userId: user2.id,
    },
  });

  // Create notes
  const note1 = await prisma.note.upsert({
    where: { id: 'note-1' },
    update: {},
    create: {
      id: 'note-1',
      title: 'Two Sum - Hash Map Approach',
      content: 'The Two Sum problem can be solved efficiently using a hash map. We iterate through the array once, storing each number and its index in the hash map. For each number, we check if its complement (target - current number) exists in the hash map.',
      topic: 'ARRAYS',
      difficulty: 'EASY',
      tags: ['hash-map', 'arrays', 'two-pointer'],
      userId: user1.id,
      isPublic: true,
    },
  });

  const note2 = await prisma.note.upsert({
    where: { id: 'note-2' },
    update: {},
    create: {
      id: 'note-2',
      title: 'Valid Parentheses - Stack Solution',
      content: 'The Valid Parentheses problem is a classic stack application. We use a stack to keep track of opening brackets. When we encounter a closing bracket, we check if it matches the most recent opening bracket on the stack.',
      topic: 'STACK',
      difficulty: 'EASY',
      tags: ['stack', 'string', 'matching'],
      userId: user2.id,
      isPublic: false,
    },
  });

  // Create submissions
  const submission1 = await prisma.submission.upsert({
    where: { id: 'submission-1' },
    update: {},
    create: {
      id: 'submission-1',
      code: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}',
      language: 'javascript',
      status: 'ACCEPTED',
      score: 100,
      userId: user1.id,
      contestId: contest1.id,
      problemId: problem1.id,
    },
  });

  const submission2 = await prisma.submission.upsert({
    where: { id: 'submission-2' },
    update: {},
    create: {
      id: 'submission-2',
      code: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
      language: 'python',
      status: 'ACCEPTED',
      score: 100,
      userId: user2.id,
      contestId: contest1.id,
      problemId: problem1.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.problem.count()} problems`);
  console.log(`Created ${await prisma.contest.count()} contests`);
  console.log(`Created ${await prisma.note.count()} notes`);
  console.log(`Created ${await prisma.submission.count()} submissions`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
