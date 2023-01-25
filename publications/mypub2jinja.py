import sys
import codecs
import jinja2

def insert2jinja(inputfname, jinjafname, outputfname, metadata):
    input_file = codecs.open(inputfname, mode="r", encoding="utf-8")
    html = input_file.read()

    template = jinja2.Template(open(jinjafname).read())

    output_file = codecs.open(outputfname, "w", 
                              encoding="utf-8", 
                              errors="xmlcharrefreplace"
    )
    output_file.write(template.render({ 'html' : html, 'metadata' : metadata }))

if __name__ == '__main__':
    inputfname = sys.argv[1]
    jinjafname = sys.argv[2]
    outputfname = sys.argv[3]
    metadata = { 'title' : 'Publications' ,
                'base_url': 'http://www-personal.umich.edu/~dhiman/',
                'publications_nav_class': 'active'}
    insert2jinja(inputfname, jinjafname, outputfname, metadata)
