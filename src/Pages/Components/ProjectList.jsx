import React, { useState, useEffect } from 'react';
import { fetchProjects } from './Todo';  
import "./ProjectList.css"

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching the projects using the imported fetchProjects function
        const getProjects = async () => {
            setLoading(true);
            try {
                const fetchedProjects = await fetchProjects(); // Fetching the projects
                setProjects(fetchedProjects);  // Setting the state with fetched projects
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjects();
    }, []);  // Empty dependency array means it runs once after the initial render

    return (
        <div className="project-list-container">
            <h2>Projects</h2>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {projects.length === 0 ? (
                        <div className="no-projects">
                            <p>No projects yet</p>
                        </div>
                    ) : (
                        <div className="project-list">
                            {projects.map((project) => (
                                <div key={project.id} className="project-item">
                                    <h3>{project.name}</h3>
                                    {/* Add more details like description, tasks, etc. */}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProjectList;
