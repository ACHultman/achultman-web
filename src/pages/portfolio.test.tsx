import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortfolioPage from './portfolio'; // Adjust path as necessary
import projectsData from '@/data/projectsData'; // Adjust path as necessary

// Mock next/router
jest.mock('next/router', () => require('next-router-mock'));

// Mock next-seo
jest.mock('next-seo', () => ({
  __esModule: true,
  NextSeo: (props: any) => {
    // Basic mock: Can be expanded if specific SEO props need to be tested
    // For now, just renders null or a simple identifiable element
    // console.log('NextSeo props:', props); // For debugging
    return <title>{props.title}</title>; // Render title for basic check
  },
}));

// Mock next/image (as used in ProjectCard)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

// Mock ProjectCard component to simplify page testing
// This avoids testing ProjectCard's internals again and speeds up page tests.
jest.mock('@/components/Portfolio/ProjectCard', () => ({
  __esModule: true,
  default: ({ project }: { project: { title: string } }) => (
    <div data-testid="project-card">
      <h3>{project.title}</h3>
    </div>
  ),
}));

// Mock SectionHeading component
jest.mock('@/components/SectionHeading', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h2 data-testid="section-heading">{title}</h2>,
}));


describe('PortfolioPage', () => {
  beforeEach(() => {
    render(<PortfolioPage />);
  });

  test('renders the section heading correctly', () => {
    const headingElement = screen.getByTestId('section-heading');
    expect(headingElement).toBeInTheDocument();
    expect(within(headingElement).getByText('My Projects')).toBeInTheDocument();
  });

  test('renders the correct number of project cards', () => {
    const projectCards = screen.getAllByTestId('project-card');
    expect(projectCards.length).toBe(projectsData.length);
  });

  test('renders project titles from projectsData', () => {
    projectsData.forEach(project => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  test('renders SEO title', () => {
    // The mock for NextSeo renders a <title> tag
    // We need to ensure the document title is set correctly
    // Note: This requires `next-router-mock` to handle the router context
    // and `next-seo` mock to actually output something testable like the title.
    const expectedTitle = 'Portfolio | Your Name'; // As defined in portfolio.tsx
    expect(document.title).toBe(expectedTitle);
  });
});
