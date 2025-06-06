import { useCallback, useEffect } from 'react';
import { instructionMapper, Instruction, Todo, ExecutionResult, findTodoByText } from '../utils/instructionMapper';

interface UseInstructionMappingProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export function useInstructionMapping({ todos, setTodos }: UseInstructionMappingProps) {
  
  // 添加新任务
  const addTodo = useCallback((params?: string | number | undefined): ExecutionResult => {
    const text = typeof params === 'string' ? params : String(params || '');
    
    if (text.trim() === '') {
      return { success: false, message: '任务内容不能为空' };
    }

    const existingTodo = todos.find(todo => 
      todo.text.toLowerCase() === text.toLowerCase()
    );
    
    if (existingTodo) {
      return { success: false, message: `任务 "${text}" 已经存在` };
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false
    };
    
    setTodos(prev => [...prev, newTodo]);
    
    return { 
      success: true, 
      message: `已添加任务: "${newTodo.text}"`,
      data: newTodo
    };
  }, [todos, setTodos]);

  // 完成待办事项函数
  const completeTodoFunction = useCallback((taskIdentifier?: string | number): ExecutionResult => {
    if (!taskIdentifier) {
      return {
        success: false,
        message: '请指定要完成的任务'
      };
    }

    let targetTodo: Todo | undefined;
    
    if (typeof taskIdentifier === 'number') {
      targetTodo = todos.find(todo => todo.id === taskIdentifier);
    } else {
      targetTodo = findTodoByText(todos, taskIdentifier);
    }

    if (!targetTodo) {
      return {
        success: false,
        message: `未找到任务: ${taskIdentifier}`
      };
    }

    if (targetTodo.completed) {
      return {
        success: false,
        message: `任务 "${targetTodo.text}" 已经完成了`
      };
    }

    const updatedTodos = todos.map(todo =>
      todo.id === targetTodo!.id ? { ...todo, completed: true } : todo
    );
    
    setTodos(updatedTodos);
    
    return {
      success: true,
      message: `已完成任务: ${targetTodo.text}`,
      data: { ...targetTodo, completed: true }
    };
  }, [todos, setTodos]);

  // 删除待办事项函数
  const deleteTodoFunction = useCallback((taskIdentifier?: string | number): ExecutionResult => {
    if (!taskIdentifier) {
      return {
        success: false,
        message: '请指定要删除的任务'
      };
    }

    let targetTodo: Todo | undefined;
    
    if (typeof taskIdentifier === 'number') {
      targetTodo = todos.find(todo => todo.id === taskIdentifier);
    } else {
      targetTodo = findTodoByText(todos, taskIdentifier);
    }

    if (!targetTodo) {
      return {
        success: false,
        message: `未找到任务: ${taskIdentifier}`
      };
    }

    const updatedTodos = todos.filter(todo => todo.id !== targetTodo!.id);
    setTodos(updatedTodos);
    
    return {
      success: true,
      message: `已删除任务: ${targetTodo.text}`,
      data: targetTodo
    };
  }, [todos, setTodos]);

  // 列出所有待办事项函数
  const listTodosFunction = useCallback((): ExecutionResult => {
    const completedCount = todos.filter(todo => todo.completed).length;
    const pendingCount = todos.length - completedCount;
    
    return {
      success: true,
      message: `共有 ${todos.length} 个任务，其中 ${completedCount} 个已完成，${pendingCount} 个待完成`,
      data: todos
    };
  }, [todos]);

  // 清除已完成任务函数
  const clearCompletedFunction = useCallback((): ExecutionResult => {
    const completedTodos = todos.filter(todo => todo.completed);
    
    if (completedTodos.length === 0) {
      return {
        success: false,
        message: '没有已完成的任务需要清除'
      };
    }

    const updatedTodos = todos.filter(todo => !todo.completed);
    setTodos(updatedTodos);
    
    return {
      success: true,
      message: `已清除 ${completedTodos.length} 个已完成的任务`,
      data: completedTodos
    };
  }, [todos, setTodos]);

  // 清除所有任务函数
  const clearAllFunction = useCallback((): ExecutionResult => {
    if (todos.length === 0) {
      return {
        success: false,
        message: '没有任务需要清除'
      };
    }

    const clearedCount = todos.length;
    setTodos([]);
    
    return {
      success: true,
      message: `已清除所有 ${clearedCount} 个任务`,
      data: todos
    };
  }, [todos, setTodos]);

  // 注册所有函数到映射器
  useEffect(() => {
    instructionMapper.registerFunction('add', addTodo);
    instructionMapper.registerFunction('complete', completeTodoFunction);
    instructionMapper.registerFunction('delete', deleteTodoFunction);
    instructionMapper.registerFunction('list', listTodosFunction);
    instructionMapper.registerFunction('clear_completed', clearCompletedFunction);
    instructionMapper.registerFunction('clear_all', clearAllFunction);
  }, [
    addTodo,
    completeTodoFunction,
    deleteTodoFunction,
    listTodosFunction,
    clearCompletedFunction,
    clearAllFunction
  ]);

  // 执行指令的主函数
  const executeInstruction = useCallback((instruction: Instruction): ExecutionResult => {
    console.log('执行指令:', instruction);
    const result = instructionMapper.executeInstruction(instruction);
    console.log('执行结果:', result);
    return result;
  }, []);

  // 获取支持的操作列表
  const getSupportedActions = useCallback((): string[] => {
    return instructionMapper.getRegisteredActions();
  }, []);

  return {
    executeInstruction,
    getSupportedActions,
    // 直接导出各个函数，以便组件可以直接调用
    addTodo,
    completeTodo: completeTodoFunction,
    deleteTodo: deleteTodoFunction,
    listTodos: listTodosFunction,
    clearCompleted: clearCompletedFunction,
    clearAll: clearAllFunction
  };
} 