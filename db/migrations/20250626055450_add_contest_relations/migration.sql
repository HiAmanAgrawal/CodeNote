-- CreateTable
CREATE TABLE "ContestParticipant" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "name" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContestParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContestToProblem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ContestParticipant_contestId_userId_key" ON "ContestParticipant"("contestId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContestToProblem_AB_unique" ON "_ContestToProblem"("A", "B");

-- CreateIndex
CREATE INDEX "_ContestToProblem_B_index" ON "_ContestToProblem"("B");

-- AddForeignKey
ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToProblem" ADD CONSTRAINT "_ContestToProblem_A_fkey" FOREIGN KEY ("A") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestToProblem" ADD CONSTRAINT "_ContestToProblem_B_fkey" FOREIGN KEY ("B") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
