import React, { useState } from 'react';
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { selectIsAuthData } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuthData);
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const inputFileRef = React.useRef(null);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            console.log('Uploading file:', file);
            const { data } = await axios.post('/upload', formData);
            console.log('Upload response:', data);
            setImageUrl(data.url);
        } catch (err) {
            console.warn('File upload error:', err);
            alert('Ошибка при загрузке файла');
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    const onChange = React.useCallback((text) => {
        setText(text);
    }, []);

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const fields = {
                title,
                imageUrl,
                tags: tags.split(',').map(tag => tag.trim()), // Преобразование строки тегов в массив
                text,
            };

            console.log('Submitting post:', fields);

            const { data } = await axios.post('/posts', fields);
            console.log('Post creation response:', data);
            const id = data._id;
            navigate(`/posts/${id}`);
        } catch (err) {
            console.warn('Post creation error:', err);
            alert('Ошибка при создании статьи');
        }
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
                uniqueId: 'add-post-editor',
            },
        }),
        [],
    );

    console.log(`http://localhost:4444${imageUrl}`);

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
                </>
            )}

            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Тэги"
                fullWidth
            />
            <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
            <div className={styles.buttons}>
                <Button size="large" variant="contained" onClick={onSubmit}>
                    Опубликовать
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
