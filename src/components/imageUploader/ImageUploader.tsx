import React, { useState } from 'react';
import './ImageUploader.scss';
import axios from 'axios';

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [objectInfo, setObjectInfo] = useState<[]>([]);
  const [resultsFolder, setResultsFolder] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Будь ласка, виберіть файл.');
      return;
    }

    setProcessing(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:5000/process_image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setObjectInfo(response.data.object_info);
      setResultsFolder(response.data.results_folder);
    } catch (error) {
      console.error('Помилка при завантаженні файлу:', error);
      alert('Сталася помилка при обробці зображення.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadResult = (filename: string) => {
    const url = `http://localhost:5000/results/${resultsFolder}/${filename}`;
    window.open(url, '_blank');
  };

  return (
    <div className='imageUploader'>
      <h1 className='imageUploader__title'>
        Завантаження зображення для аналізу
      </h1>
      <input
        className='imageUploader__input'
        type='file'
        accept='image/*'
        onChange={handleFileChange}
      />
      <button
        className='imageUploader__button'
        onClick={handleUpload}
        disabled={processing}
      >
        {processing ? 'Обробка...' : 'Відправити'}
      </button>

      {objectInfo.length > 0 && (
        <div>
          <h2>Інформація про виявлені об'єкти</h2>
          {/* <pre>{JSON.stringify(objectInfo, null, 2)}</pre> */}

          <h3>Завантажити результати:</h3>
          <ul className='imageUploader__list'>
            <li>
              <button onClick={() => handleDownloadResult('edges.jpg')}>
                edges.jpg
              </button>
            </li>
            <li>
              <button onClick={() => handleDownloadResult('contours.jpg')}>
                contours.jpg
              </button>
            </li>
            <li>
              <button onClick={() => handleDownloadResult('watershed.jpg')}>
                watershed.jpg
              </button>
            </li>
            <li>
              <button onClick={() => handleDownloadResult('kmeans.jpg')}>
                kmeans.jpg
              </button>
            </li>
            <li>
              <button onClick={() => handleDownloadResult('sift.jpg')}>
                sift.jpg
              </button>
            </li>
            <li>
              <button onClick={() => handleDownloadResult('yolo.jpg')}>
                yolo.jpg
              </button>
            </li>
            <li>
              <button onClick={() => handleDownloadResult('object_info.json')}>
                object_info.json
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
