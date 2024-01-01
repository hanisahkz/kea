"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircledIcon, Pencil2Icon, CheckIcon } from "@radix-ui/react-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { v4 as uuid4 } from 'uuid';
import { useEffect, useRef, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const crypto = require('crypto');

const STORAGE_APP_KEY = "appData";

export type AppData = {
  id: string,
  baselineValue: string,
  baselineValueHash: string,
  createdTimeStamp: Date,
  status?: "All good" | "Change detected",
  updatedValue?: string,
  updatedValueHash?: string,
  updatedTimestamp?: Date,
  showStatusMessage?: boolean,
  isEditing?: boolean,
}

const generateHash = (input: string): string => {
  const hashOptions = {
    algorithm: "sha256",
    digestFormat: "base64"
  }
  
  return crypto
    .createHash(hashOptions.algorithm)
    .update(input)
    .digest(hashOptions.digestFormat)
}

const bV1 = "hello world"
const bV2 = "goodbye world"
const currentDateTime = new Date();

// TODO: Buggy. Timestamp not properly generated
const getLaterDateTime = (dateTime: any) => {
  const futureDateTime = dateTime.setDate(dateTime.getDate() + 5)
  return new Date(futureDateTime);
}

const initialData = [
  {
    id: uuid4(),
    baselineValue: bV1,
    baselineValueHash: generateHash(bV1),
    createdTimeStamp: currentDateTime,
    status: "All good",
    updatedValue: bV1,
    updatedValueHash: generateHash(bV1),
    updatedTimestamp: currentDateTime,
  },
  {
    id: uuid4(),
    baselineValue: bV2,
    baselineValueHash: generateHash(bV2),
    createdTimeStamp: currentDateTime,
    status: "Change detected",
    updatedValue: `${bV2.toUpperCase()}`,
    updatedValueHash: generateHash(bV2.toUpperCase()),
    updatedTimestamp: getLaterDateTime(currentDateTime),
  }
]

export default function IntegrityPage() {
  // TODO: Temporarily use type any
  const [appData, setAppData] = useState<any>([])
  const updateBVInputRef = useRef<HTMLInputElement>(null);
  const addBVInputRef = useRef<HTMLInputElement>(null);

  const toggleEditMode = (data: AppData) => {
    data.isEditing = !data.isEditing
    setAppData([...appData]) // TODO: monitoring this as might be redundant
  }

  const updateValue = (data: AppData) => {
    if (updateBVInputRef.current != null) {
      data.updatedValue = updateBVInputRef.current.value
    }
    data.isEditing = false
    localStorage.setItem(STORAGE_APP_KEY, JSON.stringify(appData))
    setAppData([...appData]) // buggy // TODO: monitoring this as might be redundant
  }

  const addValue = () => {
    if (addBVInputRef.current != null) {
      const newBV = addBVInputRef.current.value
      const currentDateTime = new Date();
      const newData: AppData = {
        id: uuid4(),
        baselineValue: newBV,
        baselineValueHash: generateHash(newBV),
        createdTimeStamp: currentDateTime,
        status: "All good",
        updatedValue: newBV,
        updatedValueHash: generateHash(newBV),
        updatedTimestamp: getLaterDateTime(currentDateTime)
      }
      setAppData([...appData, newData])
    }
    localStorage.setItem(STORAGE_APP_KEY, JSON.stringify(appData))
  }
  
  const renderBaselineValue = (data: AppData) => {
    return data.isEditing ? (
      <div className="flex">
        <Input ref={updateBVInputRef} type="text" id="input-bV" placeholder="Change value here..." />
        <Button className="ml-4 h-8 w-12" size="icon">
          <CheckIcon 
            className="h-4 w-4"
            onClick={() => updateValue(data)}
          ></CheckIcon>
        </Button>
        <Button 
          variant="ghost"
          onClick={() => toggleEditMode(data)}
        >Cancel</Button>
      </div>
    ) : (
      <div className="flex">
        <Pencil2Icon 
          className="mr-2 h-4 w-4"
          onClick={() => toggleEditMode(data)}
        ></Pencil2Icon>
        <span>
          {data.baselineValue}
        </span>
      </div>
    )
  }

  const getCreatedTimestamp = (data: AppData) => data.createdTimeStamp.toString()
  
  const getUpdatedTimestamp = (data: AppData) => {
    if (data.updatedTimestamp !== undefined) {
      return data.updatedTimestamp.toString()
    }
  }
  
  const renderStatusMessage = (data: AppData) => {
    return data.baselineValue == data.updatedValue ? (
      <div>
          <p className="text-green-400">Hash value matches: </p>
          <span className="leading-10 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            <code>
              {data.baselineValueHash}
            </code>
          </span>
      </div>
    ) : (
      <div>
        <div>
          <p className="text-red-500">Hash value mismatch: </p>
        </div>
        <div className="mt-6 ml-6">
          <div>
            <span><u>Baseline value</u></span>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>
                <span>Value: {data.baselineValue}</span>
              </li>
              <li>
                <span>Hash value: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data.baselineValueHash}</code></span>
              </li>
              <li>
                <span>Added on: {getCreatedTimestamp(data)}</span>
              </li>
            </ul>
          </div>
          <div>
            <span><u>Updated value</u></span>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>
                <span>Value: {data.updatedValue}</span>
              </li>
              <li>
                <span>Hash value: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data.updatedValueHash}</code></span>
              </li>
              <li>
                <span>Changed on: {getUpdatedTimestamp(data)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  // TODO: Buggy, there's issue with data being overridden
  // we can check for if appData is empty, then initialize the React state
  // only start to store in app data when edit current data or add new data
  useEffect(() => {
    localStorage.setItem(STORAGE_APP_KEY, JSON.stringify(initialData));
    const appDataFromStorage: string = localStorage.getItem(STORAGE_APP_KEY) || "[]"
    const defaultAppData = JSON.parse(appDataFromStorage);

    const transformedAppData = defaultAppData.map((appData: AppData) => ({
      ...appData,
      isEditing: false,
      showStatusMessage: true
    }))
    setAppData(transformedAppData);
  }, [])

  // TODO: The components here can be moved into smaller components
  return (
    <div className="container my-12">
      <div>
        <section>
          <h1 className='text-center text-6xl font-bold leading-loose tracking-tighter'>Data Integrity Checker</h1>
        </section>
      </div>
      <div className='grid grid-cols-3 my-4'>
        <div className='col-start-2'>
          <section className='flex w-full max-w-sm items-center space-x-2'>
            <Input ref={addBVInputRef} type="text" placeholder="Add input here..." />
            <Button onClick={() => addValue()}>
              <PlusCircledIcon className="mr-2 h-4 w-4"></PlusCircledIcon>
              Add
            </Button>
          </section>
        </div>
      </div>
      <div className='grid grid-cols-1 my-12'>
        <div className='col-start-1'>
          <section>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Baseline Value</TableHead>
                <TableHead className="w-2/3">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appData.map((data: AppData) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">
                    {renderBaselineValue(data)}
                  </TableCell>
                  <TableCell>
                    <Accordion type="single" collapsible className="w-full" defaultValue={data.showStatusMessage ? data.id : ""}>
                      <AccordionItem value={data.id} className="border-b-0">
                        <Badge className="mt-4">
                          <span>
                          {data.status}
                          </span>
                        </Badge>
                        <AccordionTrigger>Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="ml-6 my-4">
                            {renderStatusMessage(data)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </section>
        </div>
      </div>
    </div>
  )
}