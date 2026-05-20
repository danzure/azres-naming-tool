import { Github, Linkedin, BookOpen, Scale } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-[#edebe9] dark:border-[#484644] bg-white dark:bg-[#252423] transition-colors">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between text-[13px] text-[#605e5c] dark:text-[#a19f9d]">
                <div className="mb-4 md:mb-0 flex items-center gap-1">
                    <span>&copy; {new Date().getFullYear()}</span>
                    <a href="https://www.linkedin.com/in/danielpowley92/" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-[#0078d4] dark:hover:text-[#60cdff] transition-colors ml-1">
                        Daniel Powley
                    </a>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    <a href="https://blog.atozazure.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#0078d4] dark:hover:text-[#60cdff] transition-colors">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Blog</span>
                    </a>
                    <a href="https://github.com/danzure/azres-naming-tool" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#0078d4] dark:hover:text-[#60cdff] transition-colors">
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/danielpowley92/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#0078d4] dark:hover:text-[#60cdff] transition-colors">
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                    </a>
                    <div className="hidden sm:block w-px h-4 bg-[#edebe9] dark:bg-[#484644]"></div>
                    <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#0078d4] dark:hover:text-[#60cdff] transition-colors">
                        <Scale className="w-3.5 h-3.5" />
                        <span>MIT License</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
