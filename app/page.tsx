"use client"

import { FlipWords } from "@/components/flip-words";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { placeholders } from "@/lib/placeholder";
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const[input,setInput] = useState('');
  const[searchResults,setSearchResults] = useState<{
    results:string[],
    duration:number
  }>()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const words = ["queries", "response", "country", "place"]

  //we are using useEffect() to call the fetchData function 
  useEffect(()=>{
  const fetchData = async() => {
  if(!input) return setSearchResults(undefined);
  //if input is valid then
  const res = await fetch(`/api/search?q=${input}`)
  const data = (await res.json()) as {results:string[]; duration:number }
  setSearchResults(data);
  }
  fetchData();
  },[input])

  return (
    <main className="h-screen w-screen bg-black">
    <div className="flex flex-col items-center max-w-6xl mx-auto
    pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
    <div className=" text-xl md:text-5xl flex tracking-tight -mb-64 md:-mb-64 mx-auto font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text  text-transparent backdrop-blur-none">
        Search
        <FlipWords words={words} />
        faster
        <div className="text-yellow-500 font-extrabold">⚡️</div>
    </div>
    {/* <Input 
    value={input}
    className="w-fit backdrop-blur-sm"
    onChange={(e)=>setInput(e.target.value)}
    type="text"
    /> */}
    <div className="md:max-w-md mx-auto w-full backdrop-blur-none pt-72">
      <p className="text-md mb-6 -mt-4 text-slate-400 max-w-md text-center">
        A high-peformance API built with Hono,Cloudflare Workers
      <br/>
      Type a query and get the response in ms.
      </p>
    <Command className="rounded-lg border shadow-md ">
      <CommandInput 
      value={input}
      onValueChange={setInput}
      placeholder="Search for countries..." 
      />
      <CommandList>
        {searchResults?.results.length===0 ?
          <CommandEmpty>No results found.</CommandEmpty>
          : null
        }
        {
          searchResults?.results ? (
            <CommandGroup heading="Results">
            {searchResults?.results.map((result)=>(
              <CommandItem key={result} value={result}
              onSelect={setInput}
              >{result}</CommandItem>
            ))}
            </CommandGroup>
          ) : null
          }
          {searchResults?.results ? (
            <CommandGroup heading="Stats">
              <CommandItem value="Duration"
              onSelect={setInput}
              >{searchResults?.duration}ms</CommandItem>
            </CommandGroup> 
          ) : null
        }
      </CommandList>
    </Command>
    </div>
    </div>  
    </main>
  );
}
