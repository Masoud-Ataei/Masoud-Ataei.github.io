OUTDIR=.

$(OUTDIR)/mypub.html : mypub.bib $(OUTDIR)/.dirstamp
	bibtex2html -noabstract -nodoc -o $(OUTDIR)/mypub $<

$(OUTDIR)/publications.html : $(OUTDIR)/mypub.html ../index.jinja
	python mypub2jinja.py $^ $(OUTDIR)/publications.html


$(OUTDIR)/.dirstamp:
	mkdir -p $(OUTDIR)
	touch $(OUTDIR)/.dirstamp
