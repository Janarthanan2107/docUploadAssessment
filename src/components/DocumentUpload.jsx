import { useContext, useState } from "react";
import { UserContext } from "../App";

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { FileUpload } from 'primereact/fileupload';

const DocumentUpload = () => {
    const { users, setUsers } = useContext(UserContext);

    // applicant dialog && applicant input field
    const [applicantDialog, setApplicantDialog] = useState(false)
    const [applicantName, setApplicantName] = useState("")

    // document dialog && document input field
    const [documentDialogVisible, setDocumentDialogVisible] = useState(false);
    const [newDocumentName, setNewDocumentName] = useState('');

    // selection with index
    const [activeIndex, setActiveIndex] = useState(0); // mainly for track the current applicant
    const [selectedDocIndex, setSelectedDocIndex] = useState(0);

    // add applicant
    const handleAddApplicant = () => {
        if (applicantName.trim()) {
            setUsers([...users, { name: applicantName, documents: [] }])
            setApplicantName(" ")
            setApplicantDialog(false)
        }
    }

    // del applicant
    const handleDelApplicant = (index) => {
        console.log(index);
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        setUsers(updatedUsers)
    }

    // add document
    const handleAddDocument = () => {
        if (newDocumentName.trim()) {
            const updatedUsers = [...users];
            updatedUsers[activeIndex].documents.push({ name: newDocumentName, file: null })
            setUsers(updatedUsers)
            setNewDocumentName(" ")
            setDocumentDialogVisible(false)
        }
    }

    // doc selection
    const handleDocSelection = (index) => {
        setSelectedDocIndex(index)
    }

    // back
    const handleBack = () => {
        let prevDocIndex = selectedDocIndex - 1;
        let prevApplicantIndex = activeIndex;

        if (prevDocIndex < 0) {
            prevApplicantIndex = (activeIndex - 1 + users.length) % users.length;
            prevDocIndex = users[prevApplicantIndex].documents.length - 1;
        }

        // console.log(prevDocIndex, prevApplicantIndex, "next doc && applicant");

        setSelectedDocIndex(prevDocIndex);
        setActiveIndex(prevApplicantIndex)
    }

    // next
    const handleNext = () => {
        let nextDocIndex = selectedDocIndex + 1
        let nextApplicantIndex = activeIndex;

        if (nextDocIndex >= users[activeIndex].documents.length) {
            nextDocIndex = 0;
            nextApplicantIndex = (activeIndex + 1) % users.length
        }

        // console.log(nextDocIndex, nextApplicantIndex, "next doc && applicant");

        setSelectedDocIndex(nextDocIndex)
        setActiveIndex(nextApplicantIndex)

    }

    // dialog / panel title and footer
    const titleTemplate = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h2>Document Upload</h2>
                <Button className="h-3rem w-auto" label="Add Applicant" icon="pi pi-plus" onClick={() => setApplicantDialog(true)}></Button>
            </div>
        )
    }

    const applicantDialogFooter = () => {
        return (
            <div>
                <Button label="Save" icon="pi pi-check" onClick={handleAddApplicant} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setApplicantDialog(false)} className="p-button-secondary" />
            </div>
        )
    }

    const documentDialogFooter = () => {
        return (
            <div>
                <Button label="Save" icon="pi pi-check" onClick={handleAddDocument} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setDocumentDialogVisible(false)} className="p-button-secondary" />
            </div>

        )
    }

    const panelHeader = (tab, index) => {
        return (
            <span className="flex gap-3">
                <p>{tab.name}</p>
                <Button icon="pi pi-trash" className="p-button-sm" onClick={() => handleDelApplicant(index)} />
            </span>
        );
    };


    return (
        <div>
            <Card className="min-w-screen" title={titleTemplate}>

                {/* add applicant dialog */}
                <Dialog header="Add Applicant" className="w-30rem" visible={applicantDialog} onHide={() => setApplicantDialog(false)} footer={applicantDialogFooter}>
                    <div className="flex flex-column gap-2 my-3">
                        <label htmlFor="username">Name</label>
                        <InputText
                            id="username"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            aria-describedby="username-help"
                        />
                    </div>
                </Dialog>

                {/* add document dialog */}
                <Dialog header="Add" visible={documentDialogVisible} className="w-30rem" onHide={() => setDocumentDialogVisible(false)} footer={documentDialogFooter}>
                    <div className="flex flex-column gap-2 my-3">
                        <label htmlFor="document">Document Name</label>
                        <InputText
                            id="document"
                            value={newDocumentName}
                            onChange={(e) => setNewDocumentName(e.target.value)}
                        />
                    </div>
                </Dialog>



                <TabView scrollable activeIndex={activeIndex}
                    onTabChange={(e) => {
                        setActiveIndex(e.index);
                        setSelectedDocIndex(0)
                    }}>
                    {users.map((tab, index) => {
                        return (
                            <TabPanel key={index} header={panelHeader(tab, index)}>
                                <div className="flex gap-3">
                                    <div className="flex flex-column gap-3">
                                        {
                                            tab.documents.length > 0 ? (
                                                tab.documents.map((doc, index) => {
                                                    // console.log(doc, index);
                                                    return (
                                                        <div className="flex gap-3" key={index}>
                                                            <p className={`w-5rem p-4 border-round-xl cursor-pointer ${index === selectedDocIndex ? "bg-primary" : ""}`} onClick={() => { handleDocSelection(index) }}>{doc.name}</p>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <p>No documents available</p>
                                            )}

                                        {/* add doc to the applicant */}
                                        <Button label="Add" icon="pi pi-plus" className="w-auto" onClick={() => setDocumentDialogVisible(true)} />
                                    </div>
                                    {/* file upload section */}
                                    {
                                        tab.documents.length > 0 ? (
                                            <FileUpload className="w-full" emptyTemplate={<p>
                                                Drag and Drop files here.
                                            </p>} />
                                        ) : ("")
                                    }
                                </div>

                            </TabPanel>
                        )
                    })}

                </TabView>

                <div className="flex justify-content-between my-3">
                    <Button label="Back" icon="pi pi-arrow-left" onClick={handleBack} />
                    <Button label="Next" icon="pi pi-arrow-right" onClick={handleNext} />
                </div>

            </Card>
        </div>
    );
};

export default DocumentUpload;
