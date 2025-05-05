import { faCheck, faQuestion, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type MRT_ColumnDef } from "mantine-react-table";
import { Tooltip, Button } from "@mantine/core";

export type Info = {
  id: string;
  question: string;
  answer: string;
  query?: {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
};

/**
 * Returns an array of columns for a table, and sets up UI behavior
 */
export const getColumns = (
  setSelectedRow: (formData: Info) => void,
  setDescription: (description: string) => void,
  openModal: () => void
): MRT_ColumnDef<Info>[] => [
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    accessorKey: "answer",
    header: "Answer",
  },
  {
    header: "Queries",
    Cell: ({ row }) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          boxSizing: "border-box",
        }}
      >
        {row.original.query && row.original.query.status === "OPEN" ? (
          <Tooltip label="View/Update Open Query">
            <Button
              onClick={() => {
                setSelectedRow(row.original);
                setDescription(row.original.query?.description ?? "");
                openModal();
              }}
              color="red"
            >
              <FontAwesomeIcon icon={faQuestion} />
            </Button>
          </Tooltip>
        ) : null}

        {row.original.query && row.original.query.status === "RESOLVED" ? (
          <Tooltip label="View Resolved Query">
            <Button
              onClick={() => {
                setSelectedRow(row.original);
                openModal();
              }}
              color="green"
            >
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </Tooltip>
        ) : null}

        {!row.original.query ? (
          <Tooltip label="Create Query">
            <Button
              onClick={() => {
                setDescription("");
                setSelectedRow(row.original);
                openModal();
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Tooltip>
        ) : null}
      </div>
    ),
  },
];
