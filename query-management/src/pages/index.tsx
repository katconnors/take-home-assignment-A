import Image from 'next/image'
import styles from './page.module.css'
import { useMemo, useState, useEffect } from 'react'
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table'

import { Text, TextInput, Modal, Stack, Button, Tooltip } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuestion, faPlus } from '@fortawesome/free-solid-svg-icons'

type Info = {
  id: string
  question: string
  answer: string
  query?: {
    id: string
    title: string
    description?: string
    createdAt: string
    updatedAt: string
    status: string
  }
}
type FormDataResponse = {
  data: {
    formData: Info[]
  }
}

export default function Home() {
  //should be memoized or stable
  const [opened, setOpened] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Info | null>(null)
  const [form, setForm] = useState<Info[]>([])
  const [description, setDescription] = useState('')

  const onCreateQuery = (
    title: string,
    formDataId: string,
    description?: string
  ) => {
    fetch('http://127.0.0.1:8080/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        formDataId,
        description: description,
      }),
    }).catch(console.error)
  }

  const onUpdateQuery = (
    formDataId: string,
    updatedData: { description?: string; status?: string }
  ) => {
    fetch('http://127.0.0.1:8080/query/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formDataId,
        description: updatedData.description,
        status: updatedData.status ? 'RESOLVED' : undefined,
      }),
    }).catch(console.error)
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8080/form-data')
      .then(res => res.json())
      .then((data: FormDataResponse) => {
        const questionAnswer = data.data.formData
        setForm(questionAnswer)
      })
      .catch(console.error)
  }, [])

  const columns = useMemo<MRT_ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'question',
        header: 'Question',
      },
      {
        accessorKey: 'answer',
        header: 'Answer',
      },

      {
        header: 'Queries',
        Cell: ({ row }) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              padding: '0.5rem',
              boxSizing: 'border-box',
              backgroundColor:
                row.original.query && row.original.query.status === 'OPEN'
                  ? 'red'
                  : row.original.query &&
                    row.original.query.status === 'RESOLVED'
                  ? 'lightgreen'
                  : 'transparent',
            }}
          >
            {row.original.query && row.original.query.status === 'OPEN' ? (
              <Tooltip label="View/Update Open Query">
                <button
                  onClick={() => {
                    setSelectedRow(row.original)
                    setDescription(row.original.query?.description ?? '')
                    setOpened(true)
                  }}
                >
                  <FontAwesomeIcon icon={faQuestion} />
                </button>
              </Tooltip>
            ) : null}

            {row.original.query && row.original.query.status === 'RESOLVED' ? (
              <Tooltip label="View Resolved Query">
                <button
                  onClick={() => {
                    setSelectedRow(row.original)
                    setOpened(true)
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </Tooltip>
            ) : null}

            {!row.original.query ? (
              <Tooltip label="Create Query">
                <button
                  onClick={() => {
                    setSelectedRow(row.original)
                    setOpened(true)
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </Tooltip>
            ) : null}
          </div>
        ),
      },
    ],
    []
  )

  const table = useMantineReactTable({
    columns,
    data: form, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  })

  return (
    <>
      <MantineReactTable table={table} />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          selectedRow?.query ? (
            <strong>Query | {selectedRow?.question}</strong>
          ) : (
            <strong>Create a Query | {selectedRow?.question}</strong>
          )
        }
      >
        {selectedRow && (
          <Stack>
            {selectedRow.query ? (
              <div>
                <Text>Query Status: {selectedRow.query?.status}</Text>
                <Text>Last Updated: {selectedRow.query?.updatedAt}</Text>
              </div>
            ) : null}
            {selectedRow.query?.status !== 'RESOLVED' ? (
              <TextInput
                value={description}
                placeholder="Add a description here"
                onChange={e => setDescription(e.currentTarget.value)}
              />
            ) : (
              <div>{selectedRow.query.description}</div>
            )}

            {selectedRow.query && selectedRow.query.status === 'OPEN' ? (
              <div>
                <button
                  onClick={() => {
                    onUpdateQuery(selectedRow.id, { description })
                    window.location.reload()
                  }}
                >
                  Update Query
                </button>
                <br></br>
                <br></br>
                <button
                  onClick={() => {
                    onUpdateQuery(selectedRow.id, { status: 'RESOLVED' })
                    window.location.reload()
                  }}
                >
                  Resolve Query
                </button>
              </div>
            ) : null}
            {!selectedRow.query ? (
              <div>
                <button
                  onClick={() => {
                    onCreateQuery(
                      selectedRow.question,
                      selectedRow.id,
                      description
                    )
                    window.location.reload()
                  }}
                >
                  Create
                </button>
              </div>
            ) : null}

            <Button onClick={() => setOpened(false)}>Close</Button>
          </Stack>
        )}
      </Modal>
    </>
  )
}
