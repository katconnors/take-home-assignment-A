import { useState, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import { Text, TextInput, Modal, Stack, Button } from "@mantine/core";
import { Info, getColumns } from "./columns";

type FormDataResponse = {
  data: {
    formData: Info[];
  };
};

export default function Home() {
  //should be memoized or stable

  const [form, setForm] = useState<Info[]>([]);

  const [selectedRow, setSelectedRow] = useState<Info | null>(null);
  const [description, setDescription] = useState("");
  const [opened, setOpened] = useState(false);

  const onCreateQuery = (
    title: string,
    formDataId: string,
    description?: string
  ) => {
    fetch("http://127.0.0.1:8080/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        formDataId,
        description: description,
      }),
    }).catch(console.error);
  };

  const onUpdateQuery = (
    formDataId: string,
    updatedData: { description?: string; status?: string }
  ) => {
    fetch("http://127.0.0.1:8080/query/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formDataId,
        description: updatedData.description,
        status: updatedData.status ? "RESOLVED" : undefined,
      }),
    }).catch(console.error);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8080/form-data")
      .then((res) => res.json())
      .then((data: FormDataResponse) => {
        const questionAnswer = data.data.formData;
        setForm(questionAnswer);
      })
      .catch(console.error);
  }, []);

  const table = useMantineReactTable({
    columns: getColumns(setSelectedRow, setDescription, setOpened),
    data: form, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

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
                <Text>
                  Last Updated:{" "}
                  {selectedRow.query?.updatedAt &&
                    new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(selectedRow.query.updatedAt))}
                </Text>
              </div>
            ) : null}
            {selectedRow.query?.status !== "RESOLVED" ? (
              <TextInput
                value={description}
                placeholder="Add a description here"
                onChange={(e) => setDescription(e.currentTarget.value)}
              />
            ) : (
              <div>{selectedRow.query.description}</div>
            )}

            {selectedRow.query && selectedRow.query.status === "OPEN" ? (
              <div>
                <button
                  onClick={() => {
                    onUpdateQuery(selectedRow.id, { description });
                    window.location.reload();
                  }}
                >
                  Update Query
                </button>
                <br></br>
                <br></br>
                <button
                  onClick={() => {
                    onUpdateQuery(selectedRow.id, { status: "RESOLVED" });
                    window.location.reload();
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
                    );
                    window.location.reload();
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
  );
}
