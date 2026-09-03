"use client";
import {useState} from "react"; import {Button} from "@/components/ui/button";
export function CopyButton({text,label="コピー"}:{text:string;label?:string}){const[done,setDone]=useState(false);return <Button className="copy-button" type="button" onClick={async()=>{await navigator.clipboard.writeText(text);setDone(true);setTimeout(()=>setDone(false),1600)}} aria-live="polite">{done?"コピーしました":label}</Button>}
