import { useContext, useState, useRef } from "react";
import { UserContext } from "../App";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';

const DocumentList = () => {
    const { users, setUsers } = useContext(UserContext);
    
    const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(0);
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [documentName, setDocumentName] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(null);

    const toast = useRef(null);

    const handleSaveDocument = () => {
        const updatedUsers = [...users];

        if (updatedUsers.length === 0) {
            return toast.current.show({ severity: 'warn', summary: 'No Applicant Selected', detail: 'Please select an applicant first!', life: 3000 });
        }

        if (documentName.trim()) {
            if (isEditMode) {
                // Update existing document
                updatedUsers[selectedApplicantIndex].documents[selectedDocumentIndex] = {
                    name: documentName,
                    number: documentNumber || '',
                };
            } else {
                // Add new document
                updatedUsers[selectedApplicantIndex].documents.push({
                    name: documentName,
                    number: documentNumber || '',
                });
            }
            setUsers(updatedUsers);
            resetDialog();
        }
    };

    const resetDialog = () => {
        setDocumentName('');
        setDocumentNumber('');
        setSelectedDocumentIndex(null);
        setIsEditMode(false);
        setShowDocumentDialog(false);
    };

    const handleDocDialogOpen = () => {
        if (users.length === 0) {
            return toast.current.show({ severity: 'warn', summary: 'No Applicant in the list', detail: 'Please add an applicant first!', life: 3000 });
        }

        if (selectedApplicantIndex === null) {
            return toast.current.show({ severity: 'warn', summary: 'No Applicant Selected', detail: 'Please select an applicant first!', life: 3000 });
        } else {
            setShowDocumentDialog(true);
        }
    }

    const handleDeleteDocument = (index) => {
        const updatedUsers = [...users];
        updatedUsers[selectedApplicantIndex].documents.splice(index, 1);
        setUsers(updatedUsers);
        toast.current.show({ severity: 'success', summary: 'Document Deleted', detail: 'The document was successfully deleted.', life: 3000 });
    };

    const handleDocumentClick = (index) => {
        setSelectedDocumentIndex(index);
        const doc = users[selectedApplicantIndex].documents[index];
        setDocumentName(doc.name);
        setDocumentNumber(doc.number);
        setIsEditMode(true);
        setShowDocumentDialog(true);
    };

    const handleApplicantChange = (e) => {
        setSelectedApplicantIndex(e.value);
    };

    const titleBody = () => (
        <div className="flex justify-content-between align-items-center">
            <h2>Document List</h2>
            <Button label="Add Doc" icon="pi pi-plus" className="h-3rem w-4" onClick={handleDocDialogOpen} />
        </div>
    );

    const documentDialogFooter = () => (
        <div>
            <Button label={isEditMode ? "Update" : "Save"} icon="pi pi-check" onClick={handleSaveDocument} />
            <Button label="Cancel" icon="pi pi-times" onClick={resetDialog} className="p-button-secondary" />
        </div>
    );

    const documentTemplate = (doc, index) => (
        <div className="flex justify-content-between align-items-center w-full">
            <span onClick={() => handleDocumentClick(index)} className="cursor-pointer">
                {doc.name}: {doc.number}
            </span>
            <Button icon="pi pi-trash" className="p-button-danger p-button-sm ml-2" onClick={() => handleDeleteDocument(index)} />
        </div>
    );

    const currentApplicant = users[selectedApplicantIndex] || { documents: [] };

    return (
        <div>
            <Toast ref={toast} />
            <Card title={titleBody} className="w-30rem">
                {/* Document Dialog (Add/Edit) */}
                <Dialog header={isEditMode ? "Edit Document" : "Add Document"} visible={showDocumentDialog} className="w-30rem" onHide={resetDialog} footer={documentDialogFooter}>
                    <div className="flex flex-column gap-2 my-3">
                        <label htmlFor="document">Document Name</label>
                        <InputText
                            id="document"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            aria-describedby="document-help"
                        />
                        <label htmlFor="document-number">Document Number (optional)</label>
                        <InputText
                            id="document-number"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            aria-describedby="document-number-help"
                        />
                    </div>
                </Dialog>

                <div className="flex flex-column gap-3 align-items-center h-auto mx-2">
                    {/* Applicant List */}
                    <ListBox
                        value={selectedApplicantIndex}
                        options={users.map((user, index) => ({ label: user.name, value: index }))}
                        onChange={handleApplicantChange}
                        optionLabel="label"
                        className="w-full"
                        listStyle={{ maxHeight: '200px' }}
                    />

                    <h3>Documents for {currentApplicant.name}</h3>

                    <ListBox
                        value={selectedDocumentIndex}
                        options={currentApplicant.documents.map((doc, index) => ({ label: documentTemplate(doc, index), value: index }))}
                        optionLabel="label"
                        className="w-full"
                        listStyle={{ maxHeight: '200px' }}
                        onChange={(e) => handleDocumentClick(e.value)}
                    />
                </div>

            </Card>
        </div>
    );
};

export default DocumentList;
