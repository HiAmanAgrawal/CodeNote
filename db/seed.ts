import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codenote.com' },
    update: {},
    create: {
      email: 'admin@codenote.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  });

  // Create test user
  const userPassword = await hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@codenote.com' },
    update: {},
    create: {
      email: 'user@codenote.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
      image: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
  });

  // Create sample problems
  const problems = await Promise.all([
    prisma.problem.upsert({
      where: { title: 'Two Sum' },
      update: {},
      create: {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'EASY',
        topic: 'Arrays',
        tags: ['Two Pointers', 'Hash Table'],
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹'],
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: '',
          },
        ],
        testCases: [
          { input: '[2,7,11,15]', output: '[0,1]', target: 9 },
          { input: '[3,2,4]', output: '[1,2]', target: 6 },
          { input: '[3,3]', output: '[0,1]', target: 6 },
        ],
      },
    }),
    prisma.problem.upsert({
      where: { title: 'Add Two Numbers' },
      update: {},
      create: {
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
        difficulty: 'MEDIUM',
        topic: 'Linked Lists',
        tags: ['Linked List', 'Math', 'Recursion'],
        constraints: ['The number of nodes in each linked list is in the range [1, 100]', '0 ≤ Node.val ≤ 9', 'It is guaranteed that the list represents a number that does not have leading zeros.'],
        examples: [
          {
            input: 'l1 = [2,4,3], l2 = [5,6,4]',
            output: '[7,0,8]',
            explanation: '342 + 465 = 807.',
          },
        ],
        testCases: [
          { input: '[2,4,3]', output: '[7,0,8]', l2: '[5,6,4]' },
          { input: '[0]', output: '[0]', l2: '[0]' },
          { input: '[9,9,9,9,9,9,9]', output: '[8,9,9,9,0,0,0,1]', l2: '[9,9,9,9]' },
        ],
      },
    }),
    prisma.problem.upsert({
      where: { title: 'Valid Parentheses' },
      update: {},
      create: {
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'EASY',
        topic: 'Stacks',
        tags: ['Stack', 'String'],
        constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only \'()[]{}\''],
        examples: [
          {
            input: 's = "()"',
            output: 'true',
            explanation: '',
          },
          {
            input: 's = "()[]{}"',
            output: 'true',
            explanation: '',
          },
          {
            input: 's = "(]"',
            output: 'false',
            explanation: '',
          },
        ],
        testCases: [
          { input: '"()"', output: 'true' },
          { input: '"()[]{}"', output: 'true' },
          { input: '"(]"', output: 'false' },
        ],
      },
    }),
  ]);

  // Create sample contests
  const contests = await Promise.all([
    prisma.contest.upsert({
      where: { title: 'Weekly Contest #124' },
      update: {},
      create: {
        title: 'Weekly Contest #124',
        description: 'Join our weekly coding contest with 4 challenging problems!',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        endTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000), // 3.5 hours from now
        maxParticipants: 1000,
        prizePool: 500,
        isPublic: true,
        createdBy: admin.id,
        problems: {
          connect: problems.map(p => ({ id: p.id })),
        },
      },
    }),
    prisma.contest.upsert({
      where: { title: 'Algorithm Master Challenge' },
      update: {},
      create: {
        title: 'Algorithm Master Challenge',
        description: 'A challenging contest for advanced algorithms',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 27 * 60 * 60 * 1000), // Tomorrow + 3 hours
        maxParticipants: 500,
        prizePool: 1000,
        isPublic: true,
        createdBy: admin.id,
        problems: {
          connect: problems.slice(0, 2).map(p => ({ id: p.id })),
        },
      },
    }),
  ]);

  // Create sample notes
  const notes = await Promise.all([
    prisma.note.upsert({
      where: { id: 'note-1' },
      update: {},
      create: {
        id: 'note-1',
        title: 'Two Pointers Technique',
        content: 'The two pointers technique is a common algorithmic pattern used to solve array and string problems efficiently. It involves using two pointers that traverse the data structure in a specific way to achieve the desired result.',
        topic: 'Arrays',
        difficulty: 'EASY',
        tags: ['Two Pointers', 'Arrays', 'Optimization'],
        isPublic: true,
        userId: user.id,
      },
    }),
    prisma.note.upsert({
      where: { id: 'note-2' },
      update: {},
      create: {
        id: 'note-2',
        title: 'Dynamic Programming Patterns',
        content: 'Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems. Common patterns include memoization, tabulation, and state compression.',
        topic: 'Dynamic Programming',
        difficulty: 'HARD',
        tags: ['DP', 'Memoization', 'Optimization'],
        isPublic: false,
        userId: user.id,
      },
    }),
  ]);

  // Create sample submissions
  const submissions = await Promise.all([
    prisma.submission.upsert({
      where: { id: 'sub-1' },
      update: {},
      create: {
        id: 'sub-1',
        code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
        language: 'javascript',
        status: 'ACCEPTED',
        score: 100,
        userId: user.id,
        problemId: problems[0].id,
        contestId: contests[0].id,
        testCases: [
          { input: '[2,7,11,15]', expectedOutput: '[0,1]' },
          { input: '[3,2,4]', expectedOutput: '[1,2]' },
        ],
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created ${1} admin user`);
  console.log(`👤 Created ${1} test user`);
  console.log(`📝 Created ${problems.length} problems`);
  console.log(`🏆 Created ${contests.length} contests`);
  console.log(`📚 Created ${notes.length} notes`);
  console.log(`💻 Created ${submissions.length} submissions`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
