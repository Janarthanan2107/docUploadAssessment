import { createContext, useState } from 'react';

import { DocumentUpload } from './components';

// import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import "primereact/resources/themes/lara-light-blue/theme.css"

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "./App.css"

export const UserContext = createContext({});

function App() {
  const [users, setUsers] = useState([]);

  return (
    <div className='flex justify-content-center align-items-center gap-3'>
      {/* UserContext for a common platform */}
      <UserContext.Provider value={{ users, setUsers }}>
        {/* <ApplicantList /> */}
        {/* <DocumentList /> */}

        <DocumentUpload />

      </UserContext.Provider>

    </div>
  );
}

export default App;