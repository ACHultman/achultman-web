import { Project } from '../@types/project.d';

const projectsData: Project[] = [
  {
    title: 'Cool Portfolio Website',
    description: 'A personal portfolio website to showcase my skills and projects. Built with modern web technologies and a focus on clean design and user experience.',
    image: 'https://placehold.co/600x400/1D2B3A/FFFFFF?text=Portfolio_Site',
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vercel'],
    projectUrl: '#',
    sourceUrl: 'https://github.com/yourusername/portfolio' // Replace with actual username and repo
  },
  {
    title: 'E-commerce Platform Mockup',
    description: 'A conceptual design and frontend mockup for an e-commerce platform. Features product listings, shopping cart functionality, and user authentication flows.',
    image: 'https://placehold.co/600x400/4A5568/FFFFFF?text=E-commerce_Mockup',
    technologies: ['Figma', 'HTML', 'CSS', 'JavaScript', 'Vue.js'],
    projectUrl: '#',
  },
  {
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets. Allows users to explore data through various charts and graphs, providing insightful analytics.',
    image: 'https://placehold.co/600x400/7A4EBF/FFFFFF?text=Data_Dashboard',
    technologies: ['D3.js', 'React', 'Node.js', 'Express', 'MongoDB'],
    sourceUrl: '#'
  }
];

export default projectsData;
