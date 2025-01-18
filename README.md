# Code & Prompt Repository Pro

Een moderne applicatie voor het beheren van code snippets en prompts, gebouwd met React, TypeScript en Supabase.

## Features

- ✨ Organiseer code snippets in categorieën
- 🎨 Pas kleuren toe op categorieën voor visuele organisatie
- 🌙 Donkere/lichte modus
- 📋 Kopieer code met één klik
- 🔍 Filter op categorieën
- 📝 Bewerk en verwijder snippets
- 🎯 Responsive design

## Technische Stack

- React
- TypeScript
- Material-UI
- Supabase (Backend/Database)
- Vite (Build tool)

## Installatie

1. Clone de repository:

   ```bash
   git clone https://github.com/upnexxt/prompt_tool.git
   cd prompt_tool
   ```

2. Installeer dependencies:

   ```bash
   npm install
   ```

3. Maak een `.env` bestand aan in de root en vul de Supabase gegevens in:

   ```
   VITE_SUPABASE_URL=je_supabase_url
   VITE_SUPABASE_ANON_KEY=je_supabase_anon_key
   ```

4. Start de development server:
   ```bash
   npm run dev
   ```

## Database Setup

Maak de volgende tabellen aan in je Supabase database:

### Categories Tabel

```sql
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  color text
);
```

### Blocks Tabel

```sql
create table blocks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  category_id uuid references categories(id)
);
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Bouw voor productie
- `npm run preview` - Preview productie build

## License

MIT
