import { faCheck, faQuestion, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type MRT_ColumnDef } from "mantine-react-table";
import { Tooltip } from "@mantine/core";

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

export const getColumns = (
  setSelectedRow: React.Dispatch<React.SetStateAction<Info | null>>,
  setDescription: React.Dispatch<React.SetStateAction<string>>,
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
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
          backgroundColor:
            row.original.query && row.original.query.status === "OPEN"
              ? "red"
              : row.original.query && row.original.query.status === "RESOLVED"
              ? "lightgreen"
              : "transparent",
        }}
      >
        {row.original.query && row.original.query.status === "OPEN" ? (
          <Tooltip label="View/Update Open Query">
            <button
              onClick={() => {
                setSelectedRow(row.original);
                setDescription(row.original.query?.description ?? "");
                setOpened(true);
              }}
            >
              <FontAwesomeIcon icon={faQuestion} />
            </button>
          </Tooltip>
        ) : null}

        {row.original.query && row.original.query.status === "RESOLVED" ? (
          <Tooltip label="View Resolved Query">
            <button
              onClick={() => {
                setSelectedRow(row.original);
                setOpened(true);
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
                setSelectedRow(row.original);
                setOpened(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </Tooltip>
        ) : null}
      </div>
    ),
  },
];
