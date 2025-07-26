import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminAPI } from '../../api';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  
  &:hover {
    background: #1565c0;
  }
`;

const BackLink = styled(Link)`
  text-decoration: none;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CategoryName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const CategoryInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.edit {
    color: #1976d2;
  }
  
  &.delete {
    color: #f44336;
  }
  
  &.save {
    color: #4caf50;
  }
  
  &.cancel {
    color: #666;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const AddForm = styled.form`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #f44336;
`;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('카테고리 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      alert('카테고리명을 입력해주세요.');
      return;
    }
    
    try {
      await adminAPI.createCategory({ categoryName: newCategoryName });
      alert('카테고리가 추가되었습니다.');
      setNewCategoryName('');
      setShowAddForm(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
      alert('카테고리 추가에 실패했습니다.');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.categoryName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSave = async (categoryId) => {
    if (!editingName.trim()) {
      alert('카테고리명을 입력해주세요.');
      return;
    }
    
    setSavingId(categoryId);
    
    try {
      await adminAPI.updateCategory(categoryId, { categoryName: editingName });
      alert('카테고리가 수정되었습니다.');
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('카테고리 수정에 실패했습니다.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`"${categoryName}" 카테고리를 삭제하시겠습니까?\n이 카테고리를 사용하는 채용공고가 있을 수 있습니다.`)) {
      return;
    }
    
    setDeletingId(categoryId);
    
    try {
      await adminAPI.deleteCategory(categoryId);
      alert('카테고리가 삭제되었습니다.');
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('카테고리 삭제에 실패했습니다. 이 카테고리를 사용하는 채용공고가 있을 수 있습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container>
      <BackLink to="/admin">
        <FaChevronLeft /> 관리자 대시보드로 돌아가기
      </BackLink>
      
      <Header>
        <Title>직무 카테고리 관리</Title>
        {!showAddForm && (
          <AddButton onClick={() => setShowAddForm(true)}>
            <FaPlus /> 카테고리 추가
          </AddButton>
        )}
      </Header>

      {showAddForm && (
        <AddForm onSubmit={handleAdd}>
          <Input
            type="text"
            placeholder="새 카테고리명을 입력하세요"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            autoFocus
          />
          <ActionButtons>
            <IconButton type="submit" className="save">
              <FaSave size={20} />
            </IconButton>
            <IconButton type="button" className="cancel" onClick={() => {
              setShowAddForm(false);
              setNewCategoryName('');
            }}>
              <FaTimes size={20} />
            </IconButton>
          </ActionButtons>
        </AddForm>
      )}

      {loading ? (
        <LoadingMessage>로딩 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <CategoryGrid>
          {categories.length === 0 ? (
            <CategoryCard>
              <CategoryInfo>등록된 카테고리가 없습니다.</CategoryInfo>
            </CategoryCard>
          ) : (
            categories.map((category) => (
              <CategoryCard key={category.id}>
                <CategoryHeader>
                  {editingId === category.id ? (
                    <Input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <CategoryName>{category.categoryName}</CategoryName>
                  )}
                  <ActionButtons>
                    {editingId === category.id ? (
                      <>
                        <IconButton 
                          className="save" 
                          onClick={() => handleSave(category.id)}
                          disabled={savingId === category.id}
                        >
                          <FaSave />
                        </IconButton>
                        <IconButton 
                          className="cancel" 
                          onClick={handleCancelEdit}
                        >
                          <FaTimes />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          className="edit" 
                          onClick={() => handleEdit(category)}
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton 
                          className="delete" 
                          onClick={() => handleDelete(category.id, category.categoryName)}
                          disabled={deletingId === category.id}
                        >
                          <FaTrash />
                        </IconButton>
                      </>
                    )}
                  </ActionButtons>
                </CategoryHeader>
                <CategoryInfo>ID: {category.id}</CategoryInfo>
              </CategoryCard>
            ))
          )}
        </CategoryGrid>
      )}
    </Container>
  );
};

export default CategoryManagement;