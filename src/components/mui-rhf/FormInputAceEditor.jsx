import { InputLabel } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import AceEditor from 'react-ace';

const FormInput = ({ name, ...otherProps }) => {
    // ? Utilizing useFormContext to have access to the form Context
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div>
                    <InputLabel sx={{ mb: '8px', color: '#ab47bc' }} htmlFor="seats" variant="standard">
                        {otherProps.label}
                    </InputLabel>
                    <AceEditor
                        style={{ border: '2px solid #ab47bc', borderRadius: '10px' }}
                        {...field}
                        {...otherProps}
                        mode="json"
                        theme="github"
                        name="UNIQUE_ID_OF_DIV"
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{ useWorker: false }}
                        width="100%"
                        height="200px"
                    />
                </div>
            )}
        />
    );
};

export default FormInput;
