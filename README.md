<img src="./public/helmet.svg" width="200" height="200"/>

# TankAndRide

small website project to track gasoline consuption

Live website > [tank-and-ride.juliuszlioba.com](https://tank-and-ride.juliuszlioba.com/)

## Installation

Download and install with npm
```bash
git clone git@github.com:juliuszlioba/tank-and-ride.git
cd tank-and-ride
npm install
```

Before starting development <br>
1. start database <br> (Database contains migration file and dummy data to play with)
```bash
npx supabase start
```

2. fill in enviroment variables
```bash
cp .env.example .env
```

Start developing or poking around!
```bash
npm run dev
```

_!! Don't forget to shutdown database after development <br> otherwise it will keep running in the background using computer resources_
```bash
npx supabase stop
```

## Other notices
```bash
# if database was created empty, apply migration file with command:
npx supabase migration up

# generate typescript types if there are database changes:
npx supabase gen types typescript --local > ./src/types/database.types.ts
```

## Documentation

[Supabase Docs](https://supabase.com/docs)

[Supabase Nextjs inplamentation Docs](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)


Alternative example from previous version:

https://www.misha.wtf/blog/supabase-auth-next-13

https://github.com/mryechkin/nextjs-supabase-auth/tree/main/src/app