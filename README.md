<img src="./public/helmet.svg" width="200" height="200"/>

# TankAndRide

Small website project to track motorcycle fuel consuption

Live website > [tank-and-ride.juliuszlioba.com](https://tank-and-ride.juliuszlioba.com/)

## Installation

Download and install with npm
```bash
pnpm clone git@github.com:juliuszlioba/tank-and-ride.git
cd tank-and-ride
pnpm install
```

Before starting development <br>
1. start database <br> (Database contains migration file and dummy data to play with)
```bash
pnpm supabase start
```

2. fill in enviroment variables
```bash
cp .env.example .env
```

Start developing or poking around!
```bash
pnpm run dev
```

_!! Don't forget to shutdown database after development <br> otherwise it will keep running in the background using computer resources_
```bash
pnpm supabase stop
```

## Other notices
```bash
# if database was created empty, apply migration file with command:
pnpm supabase migration up

# generate typescript types if there are database changes:
pnpm supabase gen types typescript --local > ./src/utils/supabase/database.types.ts
```

## Documentation

[Supabase Docs](https://supabase.com/docs)