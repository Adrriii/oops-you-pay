import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Box,
  Typography,
  Tooltip,
  useTheme,
  Popover,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useCategoryStore, Category } from '../store/categoryStore';
import { HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';

export const CategoryManager = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  const [colorPickerType, setColorPickerType] = useState<'background' | 'text'>('background');
  const [selectedColor, setSelectedColor] = useState('#f3f4f6');
  const [selectedTextColor, setSelectedTextColor] = useState('#374151');

  const { categories, addCategory, removeCategory, updateCategory, resetToDefaults } =
    useCategoryStore();

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), selectedColor, selectedTextColor);
      setNewCategoryName('');
      setSelectedColor('#f3f4f6');
      setSelectedTextColor('#374151');
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategoryName.trim()) {
      updateCategory(editingCategory.id, {
        name: newCategoryName.trim(),
        backgroundColor: selectedColor,
        textColor: selectedTextColor,
      });
      setEditingCategory(null);
      setNewCategoryName('');
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setSelectedColor(category.backgroundColor);
    setSelectedTextColor(category.textColor);
  };

  const handleResetToDefaults = () => {
    if (confirm(t('category.manage.confirmation'))) {
      resetToDefaults();
    }
  };

  const handleColorClick = (
    event: React.MouseEvent<HTMLElement>,
    type: 'background' | 'text'
  ) => {
    setColorAnchorEl(event.currentTarget);
    setColorPickerType(type);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const colorPopoverOpen = Boolean(colorAnchorEl);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<EditIcon />}
        sx={{ mr: 2 }}
      >
        {t('category.manage.button')}
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingCategory(null);
          setNewCategoryName('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('category.manage.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('category.manage.description')}
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
            <TextField
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={editingCategory ? t('category.manage.editCategory') : t('category.manage.newCategory')}
              size="small"
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={(e) => handleColorClick(e, 'background')}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '40px',
                  backgroundColor: selectedColor,
                  borderColor: theme.palette.grey[300],
                  '&:hover': {
                    backgroundColor: selectedColor,
                    opacity: 0.9,
                    borderColor: theme.palette.grey[400],
                  },
                }}
              />
              <Button
                onClick={(e) => handleColorClick(e, 'text')}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '40px',
                  backgroundColor: selectedColor,
                  color: selectedTextColor,
                  borderColor: theme.palette.grey[300],
                  '&:hover': {
                    backgroundColor: selectedColor,
                    color: selectedTextColor,
                    opacity: 0.9,
                    borderColor: theme.palette.grey[400],
                  },
                }}
              >
                T
              </Button>
              <Button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                variant="contained"
                size="small"
                startIcon={editingCategory ? <EditIcon /> : <AddIcon />}
                disabled={!newCategoryName.trim()}
              >
                {editingCategory ? t('category.manage.actions.update') : t('category.manage.actions.add')}
              </Button>
            </Box>
          </Box>

          <Popover
            open={colorPopoverOpen}
            anchorEl={colorAnchorEl}
            onClose={handleColorClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {colorPickerType === 'background' ? t('category.manage.backgroundColor') : t('category.manage.textColor')}
              </Typography>
              <HexColorPicker
                color={colorPickerType === 'background' ? selectedColor : selectedTextColor}
                onChange={(color) => {
                  if (colorPickerType === 'background') {
                    setSelectedColor(color);
                  } else {
                    setSelectedTextColor(color);
                  }
                }}
              />
            </Paper>
          </Popover>

          <List>
            {categories.map((category) => (
              <ListItem
                key={category.id}
                secondaryAction={
                  <Box>
                    <Tooltip title={t('category.manage.actions.edit')}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => startEditing(category)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('category.manage.actions.delete')}>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeCategory(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: category.backgroundColor,
                        color: category.textColor,
                      }}
                    >
                      {category.name}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleResetToDefaults}
            startIcon={<RefreshIcon />}
            color="inherit"
          >
            {t('category.manage.resetToDefaults')}
          </Button>
          <Button onClick={() => setOpen(false)} variant="contained">
            {t('category.manage.done')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};