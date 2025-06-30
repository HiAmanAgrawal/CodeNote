import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isPublic: boolean;
  viewCount: number;
  wordCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  codeSnippets?: CodeSnippet[];
  attachments?: Attachment[];
}

export interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  description?: string;
  lineNumbers?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'link';
  url: string;
  size?: number;
}

export interface NoteFilters {
  search: string;
  category: string;
  difficulty: string;
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface NotesState {
  // State
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  filters: NoteFilters;
  selectedNotes: string[];
  viewMode: 'grid' | 'list' | 'compact';
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'difficulty' | 'category';
  sortOrder: 'asc' | 'desc';
  
  // Computed
  filteredNotes: Note[];
  favoriteNotes: Note[];
  publicNotes: Note[];
  categories: string[];
  tags: string[];
  
  // Actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  deleteMultipleNotes: (ids: string[]) => void;
  setCurrentNote: (note: Note | null) => void;
  toggleFavorite: (id: string) => void;
  togglePublic: (id: string) => void;
  incrementViewCount: (id: string) => void;
  setFilters: (filters: Partial<NoteFilters>) => void;
  clearFilters: () => void;
  setSelectedNotes: (ids: string[]) => void;
  toggleNoteSelection: (id: string) => void;
  setViewMode: (mode: 'grid' | 'list' | 'compact') => void;
  setSortBy: (sortBy: NotesState['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  duplicateNote: (id: string) => void;
  exportNotes: (ids: string[]) => void;
  importNotes: (notes: Note[]) => void;
  searchNotes: (query: string) => Note[];
  getNotesByCategory: (category: string) => Note[];
  getNotesByDifficulty: (difficulty: Note['difficulty']) => Note[];
  getNotesByTags: (tags: string[]) => Note[];
}

const initialFilters: NoteFilters = {
  search: '',
  category: '',
  difficulty: '',
  tags: [],
  isFavorite: false,
  isPublic: false,
  dateRange: {
    start: null,
    end: null,
  },
};

// Mock data for development
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Two Sum Problem - Hash Map Solution',
    content: 'The Two Sum problem is a classic algorithmic challenge where we need to find two numbers in an array that add up to a target value. The most efficient solution uses a hash map to achieve O(n) time complexity...',
    tags: ['arrays', 'hash-map', 'two-pointer'],
    category: 'Algorithms',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isFavorite: true,
    isPublic: true,
    viewCount: 45,
    wordCount: 250,
    difficulty: 'beginner',
    topic: 'Array Manipulation',
    codeSnippets: [
      {
        id: '1',
        language: 'python',
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        description: 'Hash map solution with O(n) time complexity',
        lineNumbers: true,
      },
    ],
  },
  {
    id: '2',
    title: 'Dynamic Programming - Fibonacci Sequence',
    content: 'Dynamic programming is a method for solving complex problems by breaking them down into simpler subproblems. The Fibonacci sequence is a perfect example to understand memoization and tabulation...',
    tags: ['dynamic-programming', 'memoization', 'recursion'],
    category: 'Dynamic Programming',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    isFavorite: false,
    isPublic: false,
    viewCount: 23,
    wordCount: 180,
    difficulty: 'intermediate',
    topic: 'Dynamic Programming',
  },
  {
    id: '3',
    title: 'Binary Search Tree Implementation',
    content: 'A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children, and the values are organized in a specific order...',
    tags: ['binary-search-tree', 'data-structures', 'tree'],
    category: 'Data Structures',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    isFavorite: true,
    isPublic: true,
    viewCount: 67,
    wordCount: 320,
    difficulty: 'advanced',
    topic: 'Tree Data Structures',
  },
];

export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        notes: mockNotes,
        currentNote: null,
        isLoading: false,
        error: null,
        filters: initialFilters,
        selectedNotes: [],
        viewMode: 'grid',
        sortBy: 'updatedAt',
        sortOrder: 'desc',

        // Computed properties
        get filteredNotes() {
          const { notes, filters, sortBy, sortOrder } = get();
          let filtered = [...notes];

          // Apply search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
              note =>
                note.title.toLowerCase().includes(searchLower) ||
                note.content.toLowerCase().includes(searchLower) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
          }

          // Apply category filter
          if (filters.category) {
            filtered = filtered.filter(note => note.category === filters.category);
          }

          // Apply difficulty filter
          if (filters.difficulty) {
            filtered = filtered.filter(note => note.difficulty === filters.difficulty);
          }

          // Apply tags filter
          if (filters.tags.length > 0) {
            filtered = filtered.filter(note =>
              filters.tags.some(tag => note.tags.includes(tag))
            );
          }

          // Apply favorite filter
          if (filters.isFavorite) {
            filtered = filtered.filter(note => note.isFavorite);
          }

          // Apply public filter
          if (filters.isPublic) {
            filtered = filtered.filter(note => note.isPublic);
          }

          // Apply date range filter
          if (filters.dateRange.start || filters.dateRange.end) {
            filtered = filtered.filter(note => {
              const noteDate = new Date(note.updatedAt);
              const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
              const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
              
              if (start && noteDate < start) return false;
              if (end && noteDate > end) return false;
              return true;
            });
          }

          // Apply sorting
          filtered.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
              case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
              case 'createdAt':
                aValue = new Date(a.createdAt);
                bValue = new Date(b.createdAt);
                break;
              case 'updatedAt':
                aValue = new Date(a.updatedAt);
                bValue = new Date(b.updatedAt);
                break;
              case 'difficulty':
                const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
                aValue = difficultyOrder[a.difficulty];
                bValue = difficultyOrder[b.difficulty];
                break;
              case 'category':
                aValue = a.category.toLowerCase();
                bValue = b.category.toLowerCase();
                break;
              default:
                aValue = new Date(a.updatedAt);
                bValue = new Date(b.updatedAt);
            }

            if (sortOrder === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });

          return filtered;
        },

        get favoriteNotes() {
          return get().notes.filter(note => note.isFavorite);
        },

        get publicNotes() {
          return get().notes.filter(note => note.isPublic);
        },

        get categories() {
          const categories = new Set(get().notes.map(note => note.category));
          return Array.from(categories).sort();
        },

        get tags() {
          const tags = new Set(get().notes.flatMap(note => note.tags));
          return Array.from(tags).sort();
        },

        // Actions
        setNotes: (notes) => set((state) => {
          state.notes = notes;
        }),

        addNote: (noteData) => set((state) => {
          const newNote: Note = {
            ...noteData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            viewCount: 0,
          };
          state.notes.unshift(newNote);
        }),

        updateNote: (id, updates) => set((state) => {
          const noteIndex = state.notes.findIndex(note => note.id === id);
          if (noteIndex !== -1) {
            state.notes[noteIndex] = {
              ...state.notes[noteIndex],
              ...updates,
              updatedAt: new Date(),
            };
          }
        }),

        deleteNote: (id) => set((state) => {
          state.notes = state.notes.filter(note => note.id !== id);
          if (state.currentNote?.id === id) {
            state.currentNote = null;
          }
          state.selectedNotes = state.selectedNotes.filter(noteId => noteId !== id);
        }),

        deleteMultipleNotes: (ids) => set((state) => {
          state.notes = state.notes.filter(note => !ids.includes(note.id));
          if (state.currentNote && ids.includes(state.currentNote.id)) {
            state.currentNote = null;
          }
          state.selectedNotes = state.selectedNotes.filter(noteId => !ids.includes(noteId));
        }),

        setCurrentNote: (note) => set((state) => {
          state.currentNote = note;
        }),

        toggleFavorite: (id) => set((state) => {
          const note = state.notes.find(note => note.id === id);
          if (note) {
            note.isFavorite = !note.isFavorite;
            note.updatedAt = new Date();
          }
        }),

        togglePublic: (id) => set((state) => {
          const note = state.notes.find(note => note.id === id);
          if (note) {
            note.isPublic = !note.isPublic;
            note.updatedAt = new Date();
          }
        }),

        incrementViewCount: (id) => set((state) => {
          const note = state.notes.find(note => note.id === id);
          if (note) {
            note.viewCount += 1;
          }
        }),

        setFilters: (filters) => set((state) => {
          state.filters = { ...state.filters, ...filters };
        }),

        clearFilters: () => set((state) => {
          state.filters = initialFilters;
        }),

        setSelectedNotes: (ids) => set((state) => {
          state.selectedNotes = ids;
        }),

        toggleNoteSelection: (id) => set((state) => {
          const index = state.selectedNotes.indexOf(id);
          if (index > -1) {
            state.selectedNotes.splice(index, 1);
          } else {
            state.selectedNotes.push(id);
          }
        }),

        setViewMode: (mode) => set((state) => {
          state.viewMode = mode;
        }),

        setSortBy: (sortBy) => set((state) => {
          state.sortBy = sortBy;
        }),

        setSortOrder: (order) => set((state) => {
          state.sortOrder = order;
        }),

        duplicateNote: (id) => set((state) => {
          const originalNote = state.notes.find(note => note.id === id);
          if (originalNote) {
            const duplicatedNote: Note = {
              ...originalNote,
              id: crypto.randomUUID(),
              title: `${originalNote.title} (Copy)`,
              createdAt: new Date(),
              updatedAt: new Date(),
              viewCount: 0,
              isFavorite: false,
            };
            state.notes.unshift(duplicatedNote);
          }
        }),

        exportNotes: (ids) => {
          const { notes } = get();
          const notesToExport = notes.filter(note => ids.includes(note.id));
          const dataStr = JSON.stringify(notesToExport, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },

        importNotes: (importedNotes) => set((state) => {
          const newNotes = importedNotes.map(note => ({
            ...note,
            id: crypto.randomUUID(),
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
          state.notes.unshift(...newNotes);
        }),

        searchNotes: (query) => {
          const { notes } = get();
          const searchLower = query.toLowerCase();
          return notes.filter(
            note =>
              note.title.toLowerCase().includes(searchLower) ||
              note.content.toLowerCase().includes(searchLower) ||
              note.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
              note.category.toLowerCase().includes(searchLower)
          );
        },

        getNotesByCategory: (category) => {
          const { notes } = get();
          return notes.filter(note => note.category === category);
        },

        getNotesByDifficulty: (difficulty) => {
          const { notes } = get();
          return notes.filter(note => note.difficulty === difficulty);
        },

        getNotesByTags: (tags) => {
          const { notes } = get();
          return notes.filter(note =>
            tags.some(tag => note.tags.includes(tag))
          );
        },
      })),
      {
        name: 'notes-store',
        partialize: (state) => ({
          notes: state.notes,
          filters: state.filters,
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    {
      name: 'notes-store',
    }
  )
); 