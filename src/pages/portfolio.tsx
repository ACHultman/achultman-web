import React from 'react';
import { NextSeo } from 'next-seo';
import Layout from '@/components/Layout';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/Portfolio/ProjectCard';
import projectsData from '@/data/projectsData';
import { Project } from '@/@types/project.d'; // Assuming @ is configured as a path alias to src/

const PortfolioPage: React.FC = () => {
  const pageTitle = 'Portfolio | Your Name'; // Replace 'Your Name' with actual name or site name
  const pageDescription = 'Check out my latest projects and work.';

  return (
    <Layout>
      <NextSeo
        title={pageTitle}
        description={pageDescription}
        openGraph={{
          title: pageTitle,
          description: pageDescription,
          // images: [ // Optional: Add a relevant image for social sharing
          //   {
          //     url: 'your-og-image-url.jpg', // Replace with your image
          //     width: 1200,
          //     height: 630,
          //     alt: 'Portfolio Page Image',
          //   },
          // ],
        }}
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading title="My Projects" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-12">
            {projectsData.map((project: Project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PortfolioPage;
