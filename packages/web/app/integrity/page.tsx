"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircledIcon, Pencil2Icon, CheckIcon, CaretDownIcon } from "@radix-ui/react-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { v4 as uuid4 } from 'uuid';
import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const crypto = require('crypto');

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "All good",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Change detected",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
]

const generateHash = (input: string): string => {
  // we could destructure this
  const hashOptions = {
    algorithm: "sha256",
    digestFormat: "base64"
  }
  
  return crypto
    .createHash(hashOptions.algorithm)
    .update(input)
    .digest(hashOptions.digestFormat)
}

// todo: create type for initial data
const bV = "hello world"
const initialData = [
  {
    id: uuid4(),
    baselineValue: bV,
    baselineValueHash: generateHash(bV),
    createdTimeStamp: new Date(),
    status: "all good | change detected",
    updatedValue: "value in cleartext -- will be used for comparison",
    updatedValueHash: "calculcated from baselineValue",
    updatedTimestamp: "iso timestamp -- can be used for sorting",
    isEditing: false,
    showStatusMessage: false
  }
]

const toggleEditMode = () => console.log(`toggle toggle`);

const updateValue = () => console.log(`value updated`);
  
export default function IntegrityPage() {
  const [data, setData] = useState(initialData)
  const [isOpen, setIsOpen] = useState(false) // this is tied to everyone. ditch this.

  useEffect(() => {
    // TODO: appData can be enum
    localStorage.setItem("appData", JSON.stringify(initialData));
    // const transformedAppData = JSON.parse(localStorage.getItem("appData")); // aiming to get [{}, {}]
    // const transformedAppData = [{}];
    // transformedAppData.map(appData => {
    //   appData.isEditing = false
    //   app.showStatusMessage = true
    // })
    // setData(transformedAppData);


    // console.log(data);
    // console.log(`called from local storage: ${localStorage.getItem("appData")}`);
}, [])

  // TODO: the components here can be moved into smaller components
  // perhaps, this way, we can learn more on browser storage
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
            <Input type="text" placeholder="Add input here..." />
            <Button type="submit">
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
                <TableHead className="w-1/2">Baseline Value</TableHead>
                <TableHead className="w-1/2">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {/* create function to render read or edit mode */}
                    {/* additional add truncate function */}
                    <div className="mx-2 flex items-start">
                      {/* make it into function */}
                      {/* this is the read mode / when edit is false */}
                      {/* <div>
                        <Pencil2Icon 
                          className="mr-2 h-4 w-4"
                          onClick={() => toggleEditMode()}
                        ></Pencil2Icon>
                        <span>
                          {invoice.invoice}
                        </span>
                      </div> */}
                      {/* end read mode */}
                      <div className="flex items-start">
                        <Input type="text" placeholder="Change value here..." />
                        <Button className="ml-4 h-8 w-12" size="icon">
                          <CheckIcon 
                            className="h-4 w-4"
                            onClick={() => updateValue()}
                          ></CheckIcon>
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => toggleEditMode()}
                        >Cancel</Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>

                    <Collapsible
                      open={isOpen}
                      onOpenChange={setIsOpen}
                      className="space-y-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Badge>
                          <span>
                          {invoice.paymentStatus}
                          </span>
                          <CaretDownIcon 
                            className="ml-1 h-4 w-4"
                          ></CaretDownIcon>
                        </Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        <p className="my-4 text-muted-foreground">
                          Detected change has been made on {Date.now()}
                          The original value is as follows: <br/>
                          - Ori value: <code>something</code>
                          - Change value: <code>something else</code>
                        </p>
                      </CollapsibleContent>
                    </Collapsible>


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