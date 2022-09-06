import { Draggable, Droppable } from "react-beautiful-dnd";

import Card from "./card";

/**
 *
 * @param {Object} props
 * @param {number} props.index
 * @param {{ id: number; title: string; items: { id: number; text: string}[] }} props.data
 * @returns
 */
export default function Column({ data, index }) {
  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style, margin: 10 }}
        >
          {/* header */}
          <div
            style={{
              padding: 10,
              background: snapshot.isDragging ? "lightgreen" : "green",
            }}
            {...provided.dragHandleProps}
          >
            {data.title}
          </div>
          {/* content */}
          <Droppable droppableId={data.id.toString()} type="CARD">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {data.items.map((item, index) => (
                  <Card key={index} data={item} index={index}></Card>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
