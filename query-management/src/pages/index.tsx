import Image from "next/image";
import styles from "./page.module.css";
import { useMemo, useState, useEffect } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';

import { Text, Modal, Stack, Button, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamation, faPlus } from '@fortawesome/free-solid-svg-icons'


type Info = {
  question: string;
  answer: string;
  queries: string;
};


type FormDataResponse = {
  data: {
    formData: Info[];
  };
};

export default function Home() {
  //should be memoized or stable
  const [opened, setOpened] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Info | null>(null);
  const [form,setForm] = useState<Info[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8080/form-data')
      .then((res) => res.json())
      .then((data: FormDataResponse) => {
        const questionAnswer = data.data.formData;
        setForm(questionAnswer);
      })
      .catch(console.error);
  }, []);

  
  const columns = useMemo<MRT_ColumnDef<Info>[]>(() => [
      {
        accessorKey:'question', 
        header: 'Question',
      },
      {
        accessorKey: 'answer',
        header: 'Answer',
      },
   
      {
        header: 'Queries',
        Cell: ({ row }) => (<div style= {{backgroundColor:'#d4fcd4',
          width: '100%',
          height: '100%',
          padding: '0.5rem',
          boxSizing: 'border-box',}}>
            
          <button >
          <FontAwesomeIcon icon={faPlus} />
          </button>
          <button >
          <FontAwesomeIcon icon={faCheck} />
          </button>
          <br></br>
          <Tooltip label="View/update query">
          <button onClick={
            () => {
              setSelectedRow(row.original);
              setOpened(true);
            }
          }>
          <FontAwesomeIcon icon={faExclamation} />
          </button>
    </Tooltip>
          
          </div>
        ),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: form, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <>
      <MantineReactTable table={table} />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Query | ${selectedRow?.question}`}
      >
        {selectedRow && (
          <Stack>
            
            <Text>query status</Text>
            <Text>created on</Text>
            <Text><strong>Queries:</strong> {selectedRow.queries}</Text>
            <button >
          Update Query 
          </button>
            <Button onClick={() => setOpened(false)}>Close</Button>
          </Stack>
        )}
      </Modal>
    </>
  );
}
  

