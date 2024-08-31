import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';

const ApplicantList = () => {
    const { users, setUsers } = useContext(UserContext);
    const [visible, setVisible] = useState(false);
    const [newApplicantName, setNewApplicantName] = useState('');

    const handleDeleteApplicant = (index) => {
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        setUsers(updatedUsers);
    };

    const handleAddApplicant = () => {
        if (newApplicantName.trim()) {
            setUsers([...users, { name: newApplicantName, documents: [] }]);
            setNewApplicantName('');
            setVisible(false);
        }
    };

    const titleBody = () => (
        <div className="flex justify-content-between align-items-center">
            <h2>Applicant List</h2>
            <Button label="Add" icon="pi pi-plus" className="h-3rem w-3" onClick={() => setVisible(true)} />
        </div>
    );

    const dialogFooterBody = () => (
        <div>
            <Button label="Save" icon="pi pi-check" onClick={handleAddApplicant} />
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-secondary" />
        </div>
    );

    return (
        <div>
            <Card title={titleBody} className="w-30rem">
                {/* Add Applicant Dialog */}
                <Dialog header="Add Applicant" visible={visible} className="w-30rem" onHide={() => setVisible(false)} footer={dialogFooterBody}>
                    <div className="flex flex-column gap-2 my-3">
                        <label htmlFor="username">Name</label>
                        <InputText
                            id="username"
                            value={newApplicantName}
                            onChange={(e) => setNewApplicantName(e.target.value)}
                            aria-describedby="username-help"
                        />
                    </div>
                </Dialog>

                <div className="flex flex-column gap-3 align-items-center h-auto mx-2">
                    <ListBox
                        options={users.map((user, index) => ({
                            label: (
                                <div className="flex justify-content-between align-items-center">
                                    <span>{user.name}</span>
                                    <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDeleteApplicant(index)} />
                                </div>
                            ),
                            value: index
                        }))}
                        optionLabel="label"
                        className="w-full"
                        listStyle={{ maxHeight: '200px' }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default ApplicantList;
