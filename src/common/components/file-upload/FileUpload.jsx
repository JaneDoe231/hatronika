import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Constants,
  Logger
} from 'common';

import {
  Button,
  Loader
} from 'common/components';

/*import {
  FileApi
} from 'api';*/

import
  styles
from './FileUpload.module.css';

export const FileUpload = props => {

  const inputFile = useRef();

  const mapPropsData = () => {

    return Array.isArray(props.data) ? props.data.map(d => ({
      id: d.localFileId,
      file: {
        name: d.originalFileName
      },
      uploadProgress: d.uploadProgress
    })) : [];
  };

  const [state, setState] = useState({
    files: mapPropsData()
  });

  const onUploadClick = () => {
    inputFile.current.click();
  };

  const onFileInputChange = (event) => {

    const file = event.target.files[0];

    if (file) {

      if (file.size > 2 * 1024 * 1024) {

        typeof props.onFileUploadError === 'function'
          && props.onFileUploadError('Please make sure that your file is not bigger than 2MB.');
        return;
      }

      if (props.allowedExtensions && !props.allowedExtensions.includes(file.name.split('.').pop().toLowerCase())) {

        typeof props.onFileUploadError === 'function'
          && props.onFileUploadError(`Please make sure that you upload one of the following file types: ${props.allowedExtensions.join(', ')}`);
        return;
      }

      const files = state.files;
      const localFileId = new Date().getTime();

      files.push({
        file: file,
        uploadProgress: 0,
        id: localFileId
      });

      /*FileApi.uploadFile(
        file,
        localFileId,
        fileProgressUpdate,
        props.bucketName
      )
      .then((res) => {

          if (!res.ok) {

            typeof props.onFileUploadError === 'function'
              && props.onFileUploadError(res.message);
            return;
          }

          const completedUploadProgress = 999;

          typeof props.onFileUploadComplete === 'function'
            && props.onFileUploadComplete({
              ...res.data,
              uploadProgress: completedUploadProgress
            });

          setState(prev => {
            const file = prev.files.find(f => f.id === res.data.localFileId);
            file.uploadProgress = completedUploadProgress; // upload completed
      
            return {
              ...prev,
              files: state.files
            }
          });

        })
        .catch(e => {

          Logger.error('FileUpload', 'onFileInputChange', e);
          typeof props.onFileUploadError === 'function' && props.onFileUploadError(re.message);
        });*/

      setState(prev => ({
        ...prev,
        files: files
      }));

    } else {

      typeof props.onFileUploadError === 'function' && props.onFileUploadError('Invalid file');
    }
  };

  const onRemoveFileClick = (file) => {

    setState(prev => {

      const newFiles = prev.files.filter(f => f.id !== file.id);

      typeof props.onFileRemove === 'function' && props.onFileRemove(file.id);

      return {
        ...prev,
        files: newFiles
      }
    });
  };

  const fileProgressUpdate = (e, fileId) => {

    setState(prev => {
      
      const file = prev.files.find(f => f.id === fileId);

      file.uploadProgress = Math.round((e.loaded / e.total) * 100);

      return {
        ...prev,
        files: state.files
      }
    });
  }

  useEffect(() => {

    setState(prev => ({
      ...prev,
      files: mapPropsData()
    }));

  }, [props.data]);

  const accept = Array.isArray(props.allowedTypes) && props.allowedTypes.length
      ? props.allowedTypes.join(',')
      : null;

  const fileComponents = [];

  for (const f of state.files) {

    if (!f.file) {
      continue;
    }

    fileComponents.push(
      <div
        key={f.id}
        className={styles['upload-file']}
        style={{
          backgroundColor: Constants.Colors.white,
        }}>
          <div className={styles['upload-file-text']}>
            {f.file.name}
          </div>
          <div
            className={styles['upload-file-remove']}
            style={{ backgroundColor: Constants.Colors.secondary }}
            onClick={() => onRemoveFileClick(f)}>

              {
                f.uploadProgress === 100
                  ? <Loader
                      style={{ height: '15px', width: '15px' }}
                    />
                  : f.uploadProgress > 100
                    ? 'x'
                    : `${f.uploadProgress}%`
              }
          </div>
      </div>
    );
  }

  if (!fileComponents.length) {

    fileComponents.push(
      <div
        key={'no-file'}
        className={styles['upload-file']}
        style={{
          backgroundColor: Constants.Colors.white,
        }}>
          No file uploaded
      </div>
    );
  }

  return (

    <div className={styles['container']} style={{ ...props.style }}>

      <div className={styles["top-container"]}>

        <div className={styles['title']}>{props.title || 'Document upload'}</div>

        <Button
          disabled={state.files.length >= (props.maxNumberOfFiles || 5)}
          type={"secondaryoutline"}
          text={"Select File"}
          style={{
            padding: "10px 30px",
            backgroundColor: "#FFFFFF"
          }}
          onClick={onUploadClick}
        />

      </div>

      {fileComponents}

      <input
        className={styles['upload-input']}
        accept={accept}
        type={'file'}
        onChange={onFileInputChange}
        multiple={!!props.allowMultiple}
        ref={inputFile}
      />

    </div>
  );
};