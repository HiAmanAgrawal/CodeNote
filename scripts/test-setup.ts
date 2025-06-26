#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
const prisma = new PrismaClient();

async function setupTestData() {
  console.log('🚀 Setting up test data...');

  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'USER',
      },
    });

    console.log('✅ Test user created:', user.email);

    // Create test problems
    const problems = await Promise.all([
      prisma.problem.upsert({
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
          }
        }
      }),
      prisma.problem.upsert({
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
          }
        }
      })
    ]);

    console.log('✅ Test problems created:', problems.map(p => p.title));

    // Create test notes
    const notes = await Promise.all([
      prisma.note.upsert({
        where: { id: 'note-1' },
        update: {},
        create: {
          id: 'note-1',
          title: 'Two Sum - Hash Map Approach',
          content: 'The Two Sum problem can be solved efficiently using a hash map. We iterate through the array once, storing each number and its index in the hash map. For each number, we check if its complement (target - current number) exists in the hash map.',
          topic: 'ARRAYS',
          difficulty: 'EASY',
          tags: ['hash-map', 'arrays', 'two-pointer'],
          userId: user.id,
          isPublic: true,
        }
      }),
      prisma.note.upsert({
        where: { id: 'note-2' },
        update: {},
        create: {
          id: 'note-2',
          title: 'Valid Parentheses - Stack Solution',
          content: 'The Valid Parentheses problem is a classic stack application. We use a stack to keep track of opening brackets. When we encounter a closing bracket, we check if it matches the most recent opening bracket on the stack.',
          topic: 'STACK',
          difficulty: 'EASY',
          tags: ['stack', 'string', 'matching'],
          userId: user.id,
          isPublic: true,
        }
      })
    ]);

    console.log('✅ Test notes created:', notes.map(n => n.title));

    // Create test contest
    const contest = await prisma.contest.upsert({
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
        userId: user.id,
      }
    });

    console.log('✅ Test contest created:', contest.title);

    console.log('\n🎉 Test data setup completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('\n🔗 Access your app at: http://localhost:3001');

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestData(); 