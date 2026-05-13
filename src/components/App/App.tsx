import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import { fetchNotes } from '../../services/noteService';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, searchTerm],
    queryFn: () => fetchNotes(page, 12, searchTerm),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading notes...</p>}
      
      {isError && (
        <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>
          Error loading notes.
        </p>
      )}
      
      {notes.length > 0 && !isLoading && !isError && (
        <NoteList notes={notes} />
      )}

      {notes.length === 0 && !isLoading && !isError && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}