-- Up
INSERT INTO "user" ("id","role","email","pass") VALUES
 (1,'admin','admin@test.com',''),
 (2,'customer','test@test.com','')
;
INSERT INTO "insure" ("id","title","km","price") VALUES
 (1,'킥보험 12km 상품',12,1200)
;

-- Down
DELETE FROM user;
DELETE FROM insure;