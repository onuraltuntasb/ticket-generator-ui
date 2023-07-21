import { FormControl, InputLabel, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormSelect = ({ name, label, control, defaultValue, children, ...otherProps }) => {
    const labelId = `${name}-label`;
    return (
        <FormControl {...otherProps}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Controller
                render={({ field }) => (
                    <Select {...field} labelId={labelId} label={label}>
                        {children}
                    </Select>
                )}
                name={name}
                control={control}
                defaultValue={defaultValue}
                variant="outlined"
            />
        </FormControl>
    );
};
export default FormSelect;
