-- CreateTable
CREATE TABLE "_FlollowRelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FlollowRelation_AB_unique" ON "_FlollowRelation"("A", "B");

-- CreateIndex
CREATE INDEX "_FlollowRelation_B_index" ON "_FlollowRelation"("B");

-- AddForeignKey
ALTER TABLE "_FlollowRelation" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlollowRelation" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
