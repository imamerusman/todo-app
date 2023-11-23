import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import Todos from './Todos'

afterEach(cleanup);

describe('TestTitle', () => {
    it('title is in the document', () => {
        render(<Todos />);
        const title = screen.getByText(/todos/i);
        expect(title).toBeInTheDocument();
    });
});

describe('TestDomElements', () => {
    it('the add task should be enabled', () => {
        render(<Todos />);
        expect(screen.getByRole('button', {name: /add/i})).not.toBeDisabled()
    });

    it('the text input for task should be enabled', () => {
        render(<Todos />);
        expect(screen.getByRole('textbox')).not.toBeDisabled()
    });

    it('the due date inputshould be enabled', () => {
        render(<Todos />);
        expect(screen.getByText('Due Date')).not.toBeDisabled()
    });
});