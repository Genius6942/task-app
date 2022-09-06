import { auth } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { Brightness4, Brightness7 } from "@mui/icons-material";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Menu from "../../components/Menu";
import NavBar from "../../components/NavBar";
import DragCard from "./DragDrop/card";
import TaskCard from "./DragDrop/card";
import Column from "./DragDrop/column";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [user, loading]);

  const [menuOpen, setMenuOpen] = useState(false);

  const [cardState, setCardState] = useState([
    {
      id: 1+1000000,
			title: 'first',
      items: [
        {
          id: 1,
          text: "hello",
        },
        {
          id: 2,
          text: "world",
        },
      ],
    },
    {
      id: 2 + 10000000,
			title: 'second',
      items: [
        {
          id: 3,
          text: "hi",
        },
        {
          id: 4,
          text: "mom",
        },
      ],
    },
  ]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * @param {DropResult} result
   */
  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped nowhere
    if (!result.destination) {
      return;
    }
		
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  };

  return (
    <>
      <NavBar openMenu={() => setMenuOpen(true)}></NavBar>

      <Menu open={menuOpen} setOpen={setMenuOpen}></Menu>

      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: "flex" }}
              >
                {cardState.map((column, index) => (
                  // <Draggable
                  //   key={column.id}
                  //   draggableId={column.id.toString()}
                  //   index={index}
                  // >
                  //   {(provided, snapshot) => (
                  //     <div
                  //       ref={provided.innerRef}
                  //       {...provided.draggableProps}
                  //       {...provided.dragHandleProps}
                  //     >
                  //       <Column data={column} />
                  //     </div>
                  //   )}
                  // </Draggable>
									<Column key={'col-' + column.id.toString()} data={column} index={index}></Column>
                ))}
								{provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}
