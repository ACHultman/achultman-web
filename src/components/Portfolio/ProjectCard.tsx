import React from 'react';
import Image from 'next/image';
import { Project } from '../../@types/project.d';
import ExternalLink from '../ExternalLink'; // Assuming ExternalLink is in src/components/ExternalLink.tsx
// If ChipList is available and preferred:
// import ChipList from '../ChipList'; // Assuming ChipList is in src/components/ChipList.tsx

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 m-4 transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div className="relative w-full h-56">
        <Image
          src={project.image}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{project.title}</div>
        <p className="text-gray-700 dark:text-gray-300 text-base mb-4">
          {project.description}
        </p>
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-block bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-200 text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
            {/* Alternative using ChipList if available and suitable:
            <ChipList items={project.technologies} />
            */}
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-start space-x-4">
          {project.projectUrl && (
            <ExternalLink href={project.projectUrl} className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              View Project
            </ExternalLink>
          )}
          {project.sourceUrl && (
            <ExternalLink href={project.sourceUrl} className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 font-medium">
              Source Code
            </ExternalLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
