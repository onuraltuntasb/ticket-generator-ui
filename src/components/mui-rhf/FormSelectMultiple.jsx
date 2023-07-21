import { Box, Chip, FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

const FormSelectMultiple = ({ name, label, control, defaultValue, children, items, ...otherProps }) => {
    const labelId = `${name}-label`;
    return (
        <FormControl {...otherProps}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Controller
                render={({ field }) => (
                    <Select
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={items?.find((e) => e.id === value).name} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        multiple
                        {...field}
                        labelId={labelId}
                        label={label}
                    >
                        {children}
                    </Select>
                )}
                name={name}
                control={control}
                defaultValue={defaultValue}
            />
        </FormControl>
    );
};
export default FormSelectMultiple;
