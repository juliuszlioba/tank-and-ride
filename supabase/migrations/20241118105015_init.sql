create type environment as enum (
  'city',
  'nature',
  'mix'
);

CREATE TABLE records (
	id bigint generated by default as identity primary key,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tank_add REAL not null,
  tank_mark SMALLINT not null,
  kilometrage INT not null,
  environment environment
);

CREATE POLICY "Enable read posts for all users"
ON "public"."records"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable all methods for my email only"
on "public"."records"
as permissive
for all
to authenticated
using (((auth.jwt() ->> 'email'::text) = 'julius.zlioba@gmail.com'::text));

ALTER TABLE "public"."records" ENABLE ROW LEVEL SECURITY;