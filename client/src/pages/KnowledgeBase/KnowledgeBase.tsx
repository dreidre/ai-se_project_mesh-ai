import "./KnowledgeBase.css";
import UploadArea from "../../components/UploadArea/UploadArea";
import type { KnowledgeDoc } from "../../utils/api";
import { useEffect, useState} from "react";
import { getDocuments } from "../../utils/api.ts";
import deleteIcon from "../../assets/delete.svg";




export default function KnowledgeBase() {
    const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const load = async () => {
        try {
          const res = await getDocuments();
          setDocuments(res.data || []);
        } catch {
          setError('Failed to load documents.');
        } finally {
          setIsLoading(false);
        }
      };

      load();
    }, []);

    const handleFileSelect = (file: File) => {
  const newDoc: KnowledgeDoc = {
    _id: Date.now().toString(),
    title: file.name,
    fileName: file.name,
    userId: 'local',
    createdAt: new Date().toISOString(),
  };
  setDocuments([newDoc, ...documents]);
};


  return <>
  <div className="knowledge-base">
  <h1>Manage Your Knowledge Base</h1>

  <section className="knowledge-base__content">
    <p className="knowledge-base__description">Upload documents (PDF)</p>

    <UploadArea onFileSelect={handleFileSelect}/>

    { isLoading && (<p className="message">Loading...</p>      )    }

    {!isLoading && error != null && (<p className="message error-message">Failed to load documents.</p>)}

    {!isLoading && error == null && documents.length === 0 && (<p className="message">No documents yet.</p>)}

    {!isLoading && !error && documents.length > 0 && (
      <div className="knowledge-base__documents">
          {documents.map(doc => (
              <div key={doc._id} className="knowledge-base__document">
                  <span>{doc.title}</span>
                  <button className="delete-button" type="button" aria-label="Delete">
                      <img src={deleteIcon} alt="Delete" />
                  </button>
              </div>
          ))}
      </div>
    )}

    <button className="save-button" type="button">Save</button>
  </section>
</div>
  </>;
}