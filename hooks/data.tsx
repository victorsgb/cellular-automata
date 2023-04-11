// Core dependencies
import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

// Custom utils
import Matrix from '../utils/matrix';

interface matrixProps {
  ids: number[][];
  values: boolean[][];
}

interface coinProps {
  visible: boolean;
  taken: boolean;
  position: number;
}

interface GlobalContent {
  matrix: matrixProps;
  triggerMatrixUpdate: () => void;
  triggerMatrixRestart: () => void;
}

const dataContext = createContext<GlobalContent | null>(null);

function DataProvider({ children }: any): JSX.Element {

  // Matrix related code

  let rows = 10, cols = 10;

  let grid = [
    Array.from({length: rows}, (x, i) => i),
    Array.from({length: cols}, (x, i) => i),
  ]

  let grid_ids = grid[0].map(row => grid[1].map(col => (row + col) + (cols - 1) * row));

  let alive_ids = [33, 42, 43, 53, 36, 27, 47, 56, 67];

  let grid_values = grid_ids[0].map((_row, index_row) => grid_ids[1].map((_col, index_col) => alive_ids.includes((index_row + index_col) + (cols - 1) * index_row)));

  const [matrix, setMatrix] = useState<matrixProps>({
    ids: grid_ids,
    values: grid_values
  });

  const [triggeringMatrixUpdate, setTriggeringMatrixUpdate] = useState<boolean>(false);
  const [triggeringMatrixRestart, setTriggeringMatrixRestart] = useState<boolean>(false);


  let mx = Matrix();

  function triggerMatrixUpdate() {
    setTriggeringMatrixUpdate(true);
  }

  function triggerMatrixRestart() {
    setTriggeringMatrixRestart(true);
  }

  useEffect(() => {
    if (triggeringMatrixUpdate) {
      setMatrix({
        ...matrix,
        values: mx.updateMatrix(matrix.values)
      });
      setTriggeringMatrixUpdate(false);
    }

  }, [triggeringMatrixUpdate]);

  useEffect(() => {

    if (triggeringMatrixRestart) {
      setMatrix({
        ids: grid_ids,
        values: grid_values
      });
      setTriggeringMatrixRestart(false);
    }

  }, [triggeringMatrixRestart]);

  return (
    <>
      <dataContext.Provider
        value={{
          matrix,
          triggerMatrixUpdate,
          triggerMatrixRestart
        }}
      >
        {children}
      </dataContext.Provider>
    </>
  )
}

function useData(): GlobalContent {
  const context = useContext(dataContext) as GlobalContent;
  return context;
}

export { DataProvider, useData };